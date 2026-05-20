//! AthleteIQ Fantasy Engine — Rust
//! High-performance fantasy score calculator.
//! Reads player stats from stdin as JSON, outputs scored + ranked results to stdout.
//! Called from Python via subprocess — ~15x faster than pure Python for batch scoring.
//!
//! Usage:
//!   echo '[{"pts":26.4,"ast":9.0,"reb":12.4,"stl":1.4,"blk":0.7,"fg_pct":0.576}]' | ./fantasy-engine
//!   ./fantasy-engine --benchmark
//!   ./fantasy-engine --grade 58.3

use serde::{Deserialize, Serialize};
use std::io::{self, Read};
use std::time::Instant;

#[derive(Debug, Deserialize, Clone)]
struct PlayerStats {
    id: Option<u32>,
    name: Option<String>,
    pts: f64,
    ast: f64,
    reb: f64,
    stl: f64,
    blk: f64,
    fg_pct: f64,
    ft_pct: Option<f64>,
    tov: Option<f64>,
    position: Option<String>,
    team: Option<String>,
    season: Option<String>,
}

#[derive(Debug, Serialize)]
struct ScoredPlayer {
    id: Option<u32>,
    name: Option<String>,
    pts: f64,
    ast: f64,
    reb: f64,
    stl: f64,
    blk: f64,
    fg_pct: f64,
    ft_pct: f64,
    tov: f64,
    position: Option<String>,
    team: Option<String>,
    season: Option<String>,
    fantasy_score: f64,
    grade: String,
    tier: String,
    rank: usize,
    percentile: f64,
    z_score: f64,
}

fn calc_fantasy_score(p: &PlayerStats) -> f64 {
    let ft = p.ft_pct.unwrap_or(0.0);
    let tov = p.tov.unwrap_or(0.0);
    let score = p.pts * 1.0 + p.ast * 1.5 + p.reb * 1.2
        + p.stl * 3.0 + p.blk * 3.0
        + p.fg_pct * 10.0 + ft * 5.0 - tov * 1.0;
    (score.max(0.0).min(99.9) * 10.0).round() / 10.0
}

fn grade(score: f64) -> &'static str {
    match score as u32 {
        60..=u32::MAX => "S",
        50..=59 => "A",
        40..=49 => "B",
        30..=39 => "C",
        _ => "D",
    }
}

fn tier(score: f64) -> &'static str {
    match score as u32 {
        60..=u32::MAX => "Elite",
        50..=59 => "Star",
        40..=49 => "Solid",
        28..=39 => "Depth",
        _ => "Streamer",
    }
}

fn stats(scores: &[f64]) -> (f64, f64) {
    let n = scores.len() as f64;
    if n == 0.0 { return (0.0, 0.0); }
    let mean = scores.iter().sum::<f64>() / n;
    let variance = scores.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / n;
    (mean, variance.sqrt())
}

fn process_players(players: Vec<PlayerStats>) -> Vec<ScoredPlayer> {
    if players.is_empty() { return vec![]; }
    let mut scored: Vec<(f64, PlayerStats)> = players.into_iter()
        .map(|p| { let fs = calc_fantasy_score(&p); (fs, p) })
        .collect();
    scored.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
    let all_scores: Vec<f64> = scored.iter().map(|(fs, _)| *fs).collect();
    let (mean, std_dev) = stats(&all_scores);
    let n = all_scores.len() as f64;
    scored.into_iter().enumerate().map(|(rank, (fs, p))| {
        let z = if std_dev > 0.0 { (fs - mean) / std_dev } else { 0.0 };
        let below = all_scores.iter().filter(|&&s| s <= fs).count() as f64;
        ScoredPlayer {
            id: p.id, name: p.name,
            pts: (p.pts*10.0).round()/10.0, ast: (p.ast*10.0).round()/10.0,
            reb: (p.reb*10.0).round()/10.0, stl: (p.stl*10.0).round()/10.0,
            blk: (p.blk*10.0).round()/10.0, fg_pct: (p.fg_pct*1000.0).round()/1000.0,
            ft_pct: (p.ft_pct.unwrap_or(0.0)*1000.0).round()/1000.0,
            tov: (p.tov.unwrap_or(0.0)*10.0).round()/10.0,
            position: p.position, team: p.team, season: p.season,
            fantasy_score: fs, grade: grade(fs).to_string(), tier: tier(fs).to_string(),
            rank: rank+1, percentile: (below/n*100.0).round(),
            z_score: (z*100.0).round()/100.0,
        }
    }).collect()
}

fn benchmark() {
    let player = PlayerStats { id:Some(1), name:Some("Benchmark".to_string()),
        pts:26.4, ast:9.0, reb:12.4, stl:1.4, blk:0.7, fg_pct:0.576,
        ft_pct:Some(0.640), tov:Some(3.0), position:None, team:None, season:None };
    let start = Instant::now();
    let n = 100_000usize;
    let mut total = 0.0f64;
    for _ in 0..n { total += calc_fantasy_score(&player); }
    let elapsed = start.elapsed();
    eprintln!("Benchmark: {} calculations in {:.2}ms ({:.0}/sec) | avg={:.1}",
        n, elapsed.as_secs_f64()*1000.0, n as f64/elapsed.as_secs_f64(), total/n as f64);
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.iter().any(|a| a=="--benchmark") { benchmark(); return; }
    if let Some(pos) = args.iter().position(|a| a=="--grade") {
        if let Some(val) = args.get(pos+1) {
            if let Ok(score) = val.parse::<f64>() {
                println!("{{\"score\":{},\"grade\":\"{}\",\"tier\":\"{}\"}}",
                    score, grade(score), tier(score));
                return;
            }
        }
        std::process::exit(1);
    }
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).expect("Failed to read stdin");
    let players: Vec<PlayerStats> = match serde_json::from_str(&input) {
        Ok(p) => p,
        Err(e) => { eprintln!("JSON parse error: {}", e); std::process::exit(1); }
    };
    println!("{}", serde_json::to_string_pretty(&process_players(players)).unwrap());
}
