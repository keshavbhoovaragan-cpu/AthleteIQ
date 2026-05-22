import sqlite3, os, math, time, logging

logger = logging.getLogger(__name__)
DB_PATH = os.environ.get("DB_PATH", "/tmp/athleteiq.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY, name TEXT NOT NULL,
            position TEXT, is_active INTEGER DEFAULT 1, updated_at INTEGER
        );
        CREATE TABLE IF NOT EXISTS season_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id INTEGER NOT NULL, season TEXT NOT NULL, team TEXT,
            gp INTEGER, pts REAL, ast REAL, reb REAL, stl REAL, blk REAL,
            fg_pct REAL, ft_pct REAL, tov REAL, fantasy_score REAL,
            UNIQUE(player_id, season)
        );
        CREATE TABLE IF NOT EXISTS injuries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id INTEGER, name TEXT, team TEXT, position TEXT,
            status TEXT, injury TEXT, return_est TEXT, severity TEXT, updated_at INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_ss_season ON season_stats(season);
        CREATE INDEX IF NOT EXISTS idx_ss_fs ON season_stats(fantasy_score DESC);
    """)
    conn.commit(); conn.close()

PLAYERS = [
    (203999,"Nikola Jokic","C"),(1628983,"Shai Gilgeous-Alexander","G"),
    (203507,"Giannis Antetokounmpo","F"),(1641705,"Victor Wembanyama","C"),
    (1627734,"Domantas Sabonis","C"),(1629029,"Luka Doncic","G-F"),
    (203076,"Anthony Davis","F-C"),(2544,"LeBron James","F"),
    (1630169,"Tyrese Haliburton","G"),(203497,"Rudy Gobert","C"),
    (1630162,"Anthony Edwards","G"),(1629027,"Trae Young","G"),
    (1628369,"Jayson Tatum","F"),(1630578,"Alperen Sengun","C"),
    (1628973,"Jalen Brunson","G"),(1626164,"Devin Booker","G"),
    (1628378,"Donovan Mitchell","G"),(1630595,"Cade Cunningham","G"),
    (1630596,"Evan Mobley","F-C"),(201142,"Kevin Durant","F"),
    (1628389,"Bam Adebayo","C"),(203081,"Damian Lillard","G"),
    (1626157,"Karl-Anthony Towns","C"),(1631094,"Paolo Banchero","F"),
    (1628991,"Jaren Jackson Jr.","F-C"),(1629636,"Darius Garland","G"),
    (201939,"Stephen Curry","G"),(1629651,"Nic Claxton","C"),
    (202695,"Kawhi Leonard","F"),(1631117,"Walker Kessler","C"),
    (201935,"James Harden","G"),(1627749,"Dejounte Murray","G"),
    (1628384,"OG Anunoby","F"),(1626167,"Myles Turner","C"),
    (1631096,"Chet Holmgren","C"),(203944,"Julius Randle","F"),
]

SEASON_DATA = {
    "2024-25":{
        203999:{"team":"DEN","gp":79,"pts":26.4,"ast":9.0,"reb":12.4,"stl":1.4,"blk":0.7,"fg_pct":0.576,"ft_pct":0.640,"tov":3.0},
        1628983:{"team":"OKC","gp":75,"pts":32.7,"ast":6.4,"reb":5.5,"stl":2.0,"blk":0.8,"fg_pct":0.535,"ft_pct":0.870,"tov":2.5},
        203507:{"team":"MIL","gp":73,"pts":30.4,"ast":5.4,"reb":11.9,"stl":0.9,"blk":0.7,"fg_pct":0.611,"ft_pct":0.657,"tov":3.2},
        1641705:{"team":"SAS","gp":71,"pts":25.0,"ast":3.1,"reb":11.5,"stl":1.0,"blk":3.6,"fg_pct":0.483,"ft_pct":0.794,"tov":3.2},
        1627734:{"team":"SAC","gp":79,"pts":19.9,"ast":8.3,"reb":14.4,"stl":0.7,"blk":0.6,"fg_pct":0.618,"ft_pct":0.757,"tov":2.8},
        1629029:{"team":"LAL","gp":66,"pts":28.1,"ast":7.8,"reb":7.7,"stl":1.6,"blk":0.5,"fg_pct":0.477,"ft_pct":0.784,"tov":3.5},
        203076:{"team":"DAL","gp":76,"pts":20.4,"ast":2.8,"reb":11.1,"stl":1.1,"blk":2.4,"fg_pct":0.564,"ft_pct":0.754,"tov":2.1},
        2544:{"team":"LAL","gp":71,"pts":20.9,"ast":9.2,"reb":6.1,"stl":1.3,"blk":0.6,"fg_pct":0.540,"ft_pct":0.748,"tov":3.5},
        1630169:{"team":"IND","gp":69,"pts":23.4,"ast":10.9,"reb":4.4,"stl":1.6,"blk":0.4,"fg_pct":0.472,"ft_pct":0.865,"tov":2.8},
        203497:{"team":"MIN","gp":79,"pts":14.0,"ast":1.6,"reb":12.9,"stl":0.5,"blk":2.1,"fg_pct":0.624,"ft_pct":0.677,"tov":1.2},
        1630162:{"team":"MIN","gp":76,"pts":28.8,"ast":3.7,"reb":5.0,"stl":1.4,"blk":0.8,"fg_pct":0.465,"ft_pct":0.836,"tov":2.6},
        1629027:{"team":"ATL","gp":74,"pts":23.1,"ast":11.0,"reb":3.0,"stl":1.7,"blk":0.1,"fg_pct":0.423,"ft_pct":0.907,"tov":4.0},
        1628369:{"team":"BOS","gp":74,"pts":26.9,"ast":5.3,"reb":10.0,"stl":1.4,"blk":0.2,"fg_pct":0.471,"ft_pct":0.837,"tov":2.5},
        1630578:{"team":"HOU","gp":75,"pts":21.1,"ast":5.6,"reb":9.4,"stl":0.7,"blk":1.9,"fg_pct":0.556,"ft_pct":0.708,"tov":2.5},
        1628973:{"team":"NYK","gp":77,"pts":25.9,"ast":7.7,"reb":3.6,"stl":0.9,"blk":0.2,"fg_pct":0.481,"ft_pct":0.852,"tov":2.1},
        1626164:{"team":"PHX","gp":72,"pts":27.3,"ast":4.5,"reb":4.2,"stl":1.1,"blk":0.3,"fg_pct":0.488,"ft_pct":0.882,"tov":2.6},
        1628378:{"team":"CLE","gp":73,"pts":24.9,"ast":5.7,"reb":4.5,"stl":1.7,"blk":0.3,"fg_pct":0.463,"ft_pct":0.839,"tov":2.3},
        1630595:{"team":"DET","gp":74,"pts":24.5,"ast":8.4,"reb":4.5,"stl":1.6,"blk":0.4,"fg_pct":0.432,"ft_pct":0.826,"tov":3.2},
        1630596:{"team":"CLE","gp":75,"pts":18.0,"ast":3.2,"reb":9.4,"stl":0.8,"blk":1.7,"fg_pct":0.556,"ft_pct":0.714,"tov":1.8},
        201142:{"team":"PHX","gp":75,"pts":27.1,"ast":4.2,"reb":6.6,"stl":0.9,"blk":1.1,"fg_pct":0.528,"ft_pct":0.857,"tov":3.2},
        1628389:{"team":"MIA","gp":71,"pts":20.0,"ast":4.8,"reb":10.4,"stl":1.1,"blk":1.1,"fg_pct":0.538,"ft_pct":0.757,"tov":2.5},
        203081:{"team":"MIL","gp":73,"pts":24.3,"ast":7.4,"reb":4.4,"stl":0.9,"blk":0.3,"fg_pct":0.420,"ft_pct":0.914,"tov":2.9},
        1626157:{"team":"NYK","gp":76,"pts":24.4,"ast":3.4,"reb":8.3,"stl":0.6,"blk":0.8,"fg_pct":0.512,"ft_pct":0.832,"tov":2.7},
        1631094:{"team":"ORL","gp":75,"pts":22.6,"ast":5.4,"reb":6.4,"stl":1.2,"blk":0.9,"fg_pct":0.441,"ft_pct":0.740,"tov":2.8},
        1628991:{"team":"MEM","gp":60,"pts":21.0,"ast":2.0,"reb":5.8,"stl":0.9,"blk":2.5,"fg_pct":0.472,"ft_pct":0.823,"tov":1.8},
        1629636:{"team":"CLE","gp":69,"pts":21.1,"ast":6.9,"reb":3.0,"stl":1.3,"blk":0.3,"fg_pct":0.458,"ft_pct":0.845,"tov":2.5},
        201939:{"team":"GSW","gp":74,"pts":26.6,"ast":4.7,"reb":3.6,"stl":1.1,"blk":0.4,"fg_pct":0.471,"ft_pct":0.924,"tov":2.8},
        1629651:{"team":"BKN","gp":77,"pts":13.2,"ast":2.0,"reb":8.4,"stl":0.7,"blk":2.3,"fg_pct":0.638,"ft_pct":0.591,"tov":1.5},
        202695:{"team":"LAC","gp":68,"pts":14.1,"ast":3.6,"reb":6.3,"stl":1.6,"blk":0.5,"fg_pct":0.497,"ft_pct":0.840,"tov":1.8},
        1631117:{"team":"UTA","gp":77,"pts":10.3,"ast":1.5,"reb":9.0,"stl":0.5,"blk":2.3,"fg_pct":0.712,"ft_pct":0.619,"tov":1.1},
    },
    "2023-24":{
        203999:{"team":"DEN","gp":79,"pts":26.4,"ast":9.0,"reb":12.6,"stl":1.4,"blk":0.9,"fg_pct":0.583,"ft_pct":0.631,"tov":3.0},
        1628983:{"team":"OKC","gp":75,"pts":30.1,"ast":6.2,"reb":5.5,"stl":2.0,"blk":1.0,"fg_pct":0.535,"ft_pct":0.874,"tov":2.4},
        203507:{"team":"MIL","gp":73,"pts":30.4,"ast":6.5,"reb":11.5,"stl":1.2,"blk":1.1,"fg_pct":0.611,"ft_pct":0.657,"tov":3.1},
        1641705:{"team":"SAS","gp":71,"pts":21.4,"ast":3.6,"reb":10.6,"stl":1.2,"blk":3.6,"fg_pct":0.463,"ft_pct":0.794,"tov":3.2},
        1627734:{"team":"SAC","gp":79,"pts":19.9,"ast":8.1,"reb":13.5,"stl":1.1,"blk":0.5,"fg_pct":0.601,"ft_pct":0.757,"tov":2.6},
        1629029:{"team":"DAL","gp":70,"pts":33.9,"ast":9.8,"reb":9.2,"stl":1.4,"blk":0.5,"fg_pct":0.487,"ft_pct":0.784,"tov":4.0},
        203076:{"team":"LAL","gp":76,"pts":24.7,"ast":3.5,"reb":12.6,"stl":1.2,"blk":2.3,"fg_pct":0.562,"ft_pct":0.754,"tov":2.1},
        2544:{"team":"LAL","gp":71,"pts":25.7,"ast":8.3,"reb":7.3,"stl":1.3,"blk":0.5,"fg_pct":0.540,"ft_pct":0.748,"tov":3.5},
        1630169:{"team":"IND","gp":69,"pts":20.1,"ast":10.9,"reb":3.9,"stl":1.6,"blk":0.4,"fg_pct":0.474,"ft_pct":0.865,"tov":3.1},
        203497:{"team":"MIN","gp":79,"pts":14.0,"ast":1.6,"reb":12.9,"stl":0.5,"blk":2.2,"fg_pct":0.624,"ft_pct":0.677,"tov":1.2},
        1630162:{"team":"MIN","gp":79,"pts":25.9,"ast":5.1,"reb":5.4,"stl":1.3,"blk":0.6,"fg_pct":0.462,"ft_pct":0.836,"tov":2.5},
        1629027:{"team":"ATL","gp":74,"pts":25.7,"ast":10.8,"reb":3.3,"stl":1.3,"blk":0.1,"fg_pct":0.423,"ft_pct":0.907,"tov":4.0},
        1628369:{"team":"BOS","gp":74,"pts":26.9,"ast":4.9,"reb":8.1,"stl":1.1,"blk":0.6,"fg_pct":0.471,"ft_pct":0.837,"tov":2.5},
        1628973:{"team":"NYK","gp":77,"pts":28.7,"ast":6.7,"reb":3.6,"stl":0.9,"blk":0.2,"fg_pct":0.481,"ft_pct":0.852,"tov":2.1},
        1626164:{"team":"PHX","gp":68,"pts":27.1,"ast":4.6,"reb":4.5,"stl":1.2,"blk":0.4,"fg_pct":0.492,"ft_pct":0.882,"tov":2.6},
        201939:{"team":"GSW","gp":74,"pts":26.4,"ast":5.1,"reb":4.5,"stl":0.9,"blk":0.4,"fg_pct":0.450,"ft_pct":0.924,"tov":2.8},
        203081:{"team":"MIL","gp":73,"pts":24.3,"ast":7.0,"reb":4.5,"stl":0.9,"blk":0.3,"fg_pct":0.420,"ft_pct":0.914,"tov":2.9},
        1630596:{"team":"CLE","gp":75,"pts":15.7,"ast":2.8,"reb":9.4,"stl":1.1,"blk":1.6,"fg_pct":0.551,"ft_pct":0.714,"tov":1.8},
        201142:{"team":"PHX","gp":75,"pts":27.3,"ast":4.4,"reb":6.6,"stl":0.9,"blk":1.2,"fg_pct":0.520,"ft_pct":0.857,"tov":3.2},
        1628389:{"team":"MIA","gp":71,"pts":19.3,"ast":3.6,"reb":10.4,"stl":1.1,"blk":0.9,"fg_pct":0.539,"ft_pct":0.757,"tov":2.5},
        1628991:{"team":"MEM","gp":60,"pts":22.6,"ast":2.0,"reb":6.9,"stl":0.9,"blk":3.0,"fg_pct":0.474,"ft_pct":0.823,"tov":1.8},
        1630595:{"team":"DET","gp":74,"pts":22.7,"ast":6.7,"reb":4.5,"stl":1.6,"blk":0.4,"fg_pct":0.432,"ft_pct":0.826,"tov":3.2},
        1631094:{"team":"ORL","gp":80,"pts":22.6,"ast":5.4,"reb":6.4,"stl":1.2,"blk":0.9,"fg_pct":0.441,"ft_pct":0.740,"tov":2.8},
    },
    "2022-23":{
        203999:{"team":"DEN","gp":69,"pts":24.5,"ast":9.8,"reb":11.8,"stl":1.3,"blk":0.7,"fg_pct":0.632,"ft_pct":0.705,"tov":3.0},
        1628983:{"team":"OKC","gp":68,"pts":31.4,"ast":5.5,"reb":4.8,"stl":1.6,"blk":1.0,"fg_pct":0.510,"ft_pct":0.905,"tov":2.3},
        203507:{"team":"MIL","gp":63,"pts":31.1,"ast":5.7,"reb":11.8,"stl":0.8,"blk":0.8,"fg_pct":0.553,"ft_pct":0.640,"tov":3.2},
        1629029:{"team":"DAL","gp":66,"pts":32.4,"ast":8.0,"reb":8.6,"stl":1.4,"blk":0.5,"fg_pct":0.496,"ft_pct":0.742,"tov":3.6},
        201939:{"team":"GSW","gp":56,"pts":29.4,"ast":6.3,"reb":6.1,"stl":0.9,"blk":0.4,"fg_pct":0.491,"ft_pct":0.917,"tov":2.5},
        2544:{"team":"LAL","gp":55,"pts":28.9,"ast":6.8,"reb":8.3,"stl":1.6,"blk":0.6,"fg_pct":0.500,"ft_pct":0.761,"tov":3.2},
        203081:{"team":"POR","gp":58,"pts":32.2,"ast":7.3,"reb":4.8,"stl":0.9,"blk":0.3,"fg_pct":0.424,"ft_pct":0.914,"tov":2.8},
        1628378:{"team":"CLE","gp":68,"pts":28.1,"ast":4.4,"reb":4.4,"stl":1.5,"blk":0.4,"fg_pct":0.461,"ft_pct":0.839,"tov":2.3},
        201142:{"team":"BKN","gp":39,"pts":29.7,"ast":5.3,"reb":6.4,"stl":0.8,"blk":1.4,"fg_pct":0.556,"ft_pct":0.863,"tov":3.2},
        1627734:{"team":"SAC","gp":79,"pts":19.1,"ast":7.3,"reb":12.3,"stl":1.1,"blk":0.5,"fg_pct":0.598,"ft_pct":0.746,"tov":2.5},
        1629027:{"team":"ATL","gp":73,"pts":26.2,"ast":10.2,"reb":3.0,"stl":1.1,"blk":0.2,"fg_pct":0.428,"ft_pct":0.906,"tov":4.1},
        1628369:{"team":"BOS","gp":74,"pts":30.1,"ast":4.6,"reb":8.8,"stl":1.1,"blk":0.7,"fg_pct":0.466,"ft_pct":0.854,"tov":2.5},
        1630169:{"team":"IND","gp":56,"pts":20.7,"ast":10.4,"reb":3.7,"stl":1.6,"blk":0.5,"fg_pct":0.490,"ft_pct":0.862,"tov":3.2},
        1630162:{"team":"MIN","gp":79,"pts":24.6,"ast":4.4,"reb":5.8,"stl":1.5,"blk":0.6,"fg_pct":0.462,"ft_pct":0.799,"tov":2.6},
    },
    "2021-22":{
        203999:{"team":"DEN","gp":74,"pts":27.1,"ast":7.9,"reb":13.8,"stl":1.5,"blk":0.9,"fg_pct":0.583,"ft_pct":0.709,"tov":3.1},
        203507:{"team":"MIL","gp":67,"pts":29.9,"ast":5.8,"reb":11.6,"stl":1.1,"blk":1.4,"fg_pct":0.553,"ft_pct":0.694,"tov":3.2},
        2544:{"team":"LAL","gp":56,"pts":30.3,"ast":6.2,"reb":8.2,"stl":1.3,"blk":1.1,"fg_pct":0.526,"ft_pct":0.754,"tov":3.5},
        1629029:{"team":"DAL","gp":65,"pts":28.4,"ast":8.7,"reb":9.1,"stl":1.2,"blk":0.5,"fg_pct":0.457,"ft_pct":0.742,"tov":3.6},
        203497:{"team":"UTA","gp":66,"pts":15.6,"ast":1.4,"reb":14.7,"stl":0.8,"blk":2.1,"fg_pct":0.714,"ft_pct":0.683,"tov":1.2},
        203076:{"team":"LAL","gp":40,"pts":23.2,"ast":3.1,"reb":9.9,"stl":1.2,"blk":2.3,"fg_pct":0.532,"ft_pct":0.720,"tov":2.1},
        1628369:{"team":"BOS","gp":76,"pts":26.9,"ast":4.4,"reb":8.0,"stl":1.0,"blk":0.7,"fg_pct":0.453,"ft_pct":0.854,"tov":2.5},
        1629027:{"team":"ATL","gp":76,"pts":28.4,"ast":9.7,"reb":3.7,"stl":0.8,"blk":0.2,"fg_pct":0.461,"ft_pct":0.913,"tov":4.1},
        201939:{"team":"GSW","gp":64,"pts":25.5,"ast":6.3,"reb":5.2,"stl":1.3,"blk":0.4,"fg_pct":0.437,"ft_pct":0.923,"tov":3.0},
        1627734:{"team":"IND","gp":62,"pts":18.9,"ast":5.8,"reb":12.1,"stl":1.0,"blk":0.5,"fg_pct":0.581,"ft_pct":0.740,"tov":2.5},
        203081:{"team":"POR","gp":29,"pts":24.0,"ast":7.3,"reb":4.1,"stl":0.9,"blk":0.3,"fg_pct":0.403,"ft_pct":0.924,"tov":2.9},
        1628983:{"team":"OKC","gp":56,"pts":24.5,"ast":5.9,"reb":4.8,"stl":1.4,"blk":0.9,"fg_pct":0.452,"ft_pct":0.874,"tov":2.3},
        1628378:{"team":"UTA","gp":67,"pts":25.9,"ast":5.3,"reb":4.2,"stl":1.5,"blk":0.4,"fg_pct":0.451,"ft_pct":0.839,"tov":2.3},
    },
    "2020-21":{
        203999:{"team":"DEN","gp":72,"pts":26.4,"ast":8.3,"reb":10.8,"stl":1.3,"blk":0.7,"fg_pct":0.565,"ft_pct":0.687,"tov":3.1},
        203507:{"team":"MIL","gp":61,"pts":28.1,"ast":6.1,"reb":11.0,"stl":1.2,"blk":1.2,"fg_pct":0.569,"ft_pct":0.681,"tov":3.2},
        201939:{"team":"GSW","gp":63,"pts":32.0,"ast":5.8,"reb":5.5,"stl":1.2,"blk":0.4,"fg_pct":0.482,"ft_pct":0.916,"tov":3.3},
        1629029:{"team":"DAL","gp":66,"pts":27.7,"ast":8.6,"reb":8.0,"stl":1.0,"blk":0.5,"fg_pct":0.479,"ft_pct":0.738,"tov":4.3},
        2544:{"team":"LAL","gp":45,"pts":25.0,"ast":7.7,"reb":7.7,"stl":1.1,"blk":0.6,"fg_pct":0.513,"ft_pct":0.698,"tov":3.7},
        201935:{"team":"BKN","gp":44,"pts":24.6,"ast":10.9,"reb":8.5,"stl":1.1,"blk":0.6,"fg_pct":0.463,"ft_pct":0.868,"tov":4.4},
        203081:{"team":"POR","gp":67,"pts":28.8,"ast":7.5,"reb":4.2,"stl":0.9,"blk":0.3,"fg_pct":0.455,"ft_pct":0.924,"tov":2.8},
        1627734:{"team":"IND","gp":61,"pts":20.3,"ast":6.7,"reb":12.0,"stl":0.8,"blk":0.6,"fg_pct":0.538,"ft_pct":0.740,"tov":2.5},
        203497:{"team":"UTA","gp":71,"pts":14.3,"ast":1.3,"reb":13.5,"stl":0.7,"blk":2.7,"fg_pct":0.671,"ft_pct":0.665,"tov":1.2},
        1629027:{"team":"ATL","gp":63,"pts":25.3,"ast":9.4,"reb":3.9,"stl":0.8,"blk":0.2,"fg_pct":0.436,"ft_pct":0.914,"tov":4.2},
        1628369:{"team":"BOS","gp":64,"pts":26.4,"ast":4.3,"reb":7.4,"stl":1.2,"blk":0.6,"fg_pct":0.459,"ft_pct":0.854,"tov":2.5},
        1628983:{"team":"OKC","gp":35,"pts":23.7,"ast":4.7,"reb":4.6,"stl":1.9,"blk":0.9,"fg_pct":0.507,"ft_pct":0.859,"tov":2.3},
        1628378:{"team":"UTA","gp":53,"pts":26.4,"ast":5.2,"reb":4.4,"stl":1.0,"blk":0.3,"fg_pct":0.432,"ft_pct":0.839,"tov":2.3},
    }
}

def calc_fs(s):
    return round(min(s["pts"]*1.0+s["ast"]*1.5+s["reb"]*1.2+s["stl"]*3.0+s["blk"]*3.0+s["fg_pct"]*10+s["ft_pct"]*5-s["tov"]*1.0,99.9),1)

def seed_rankings():
    conn = get_db()
    for pid,name,pos in PLAYERS:
        conn.execute("INSERT OR REPLACE INTO players (id,name,position,updated_at) VALUES (?,?,?,?)",(pid,name,pos,int(time.time())))
    for season,stats in SEASON_DATA.items():
        for pid,s in stats.items():
            conn.execute("INSERT OR REPLACE INTO season_stats (player_id,season,team,gp,pts,ast,reb,stl,blk,fg_pct,ft_pct,tov,fantasy_score) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (pid,season,s["team"],s["gp"],s["pts"],s["ast"],s["reb"],s["stl"],s["blk"],s["fg_pct"],s["ft_pct"],s["tov"],calc_fs(s)))
    conn.commit(); conn.close()
    logger.info("Rankings seeded")

def seed_injuries():
    INJURIES = [
        (203082,"Joel Embiid","PHI","C","Out","Knee","TBD","high"),
        (203114,"Khris Middleton","MIL","F","Out","Knee","Season","high"),
        (1628978,"Lonzo Ball","CHI","G","Out","Knee","TBD","high"),
        (203500,"Steven Adams","MEM","C","Out","Knee","Season","high"),
        (1629627,"Zion Williamson","NOP","F","Out","Hamstring","2-3 weeks","high"),
        (1628384,"OG Anunoby","NYK","F","Out","Elbow","TBD","high"),
        (1629029,"Luka Doncic","LAL","G-F","Questionable","Ankle","Game-time","medium"),
        (202331,"Paul George","PHI","F","Questionable","Knee","Game-time","medium"),
        (202710,"Jimmy Butler","MIA","F","Questionable","Knee","Game-time","medium"),
        (1629028,"Deandre Ayton","POR","C","Questionable","Back","Game-time","medium"),
        (1627826,"Ivica Zubac","LAC","C","Day-to-Day","Ankle","1-2 days","low"),
        (1628960,"Grayson Allen","PHX","G","Day-to-Day","Hip","2-3 days","low"),
    ]
    conn = get_db()
    conn.execute("DELETE FROM injuries")
    for i in INJURIES:
        conn.execute("INSERT INTO injuries (player_id,name,team,position,status,injury,return_est,severity,updated_at) VALUES (?,?,?,?,?,?,?,?,?)",(*i,int(time.time())))
    conn.commit(); conn.close()

init_db()
