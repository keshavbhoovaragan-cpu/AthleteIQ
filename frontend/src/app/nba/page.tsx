"use client";
import { useState } from "react";
import NavBar from "@/components/nav/NavBar";

const STAT_CATS = [
  { key:"pts", label:"Scoring", unit:"PPG" },
  { key:"ast", label:"Assists", unit:"APG" },
  { key:"reb", label:"Rebounds", unit:"RPG" },
  { key:"stl", label:"Steals", unit:"SPG" },
  { key:"blk", label:"Blocks", unit:"BPG" },
];

const CURRENT_LEADERS: any = {
  pts: [
    {name:"Shai Gilgeous-Alexander",team:"OKC",pos:"G",value:32.7,id:1628983},
    {name:"Luka Doncic",team:"LAL",pos:"G-F",value:28.1,id:1629029},
    {name:"Giannis Antetokounmpo",team:"MIL",pos:"F",value:30.4,id:203507},
    {name:"Devin Booker",team:"PHX",pos:"G",value:27.3,id:1626164},
    {name:"Kevin Durant",team:"PHX",pos:"F",value:27.1,id:201142},
    {name:"Anthony Edwards",team:"MIN",pos:"G",value:28.8,id:1630162},
    {name:"Jayson Tatum",team:"BOS",pos:"F",value:26.9,id:1628369},
    {name:"Stephen Curry",team:"GSW",pos:"G",value:26.6,id:201939},
    {name:"Nikola Jokic",team:"DEN",pos:"C",value:27.7,id:203999},
    {name:"Karl-Anthony Towns",team:"NYK",pos:"C",value:24.4,id:1626157},
    {name:"Damian Lillard",team:"MIL",pos:"G",value:24.3,id:203081},
    {name:"Tyrese Haliburton",team:"IND",pos:"G",value:23.4,id:1630169},
    {name:"Trae Young",team:"ATL",pos:"G",value:23.1,id:1629027},
    {name:"LeBron James",team:"LAL",pos:"F",value:20.9,id:2544},
    {name:"Bam Adebayo",team:"MIA",pos:"C",value:20.0,id:1628389},
    {name:"Alperen Sengun",team:"HOU",pos:"C",value:21.1,id:1630578},
    {name:"Jalen Brunson",team:"NYK",pos:"G",value:25.9,id:1628973},
    {name:"Donovan Mitchell",team:"CLE",pos:"G",value:24.9,id:1628378},
    {name:"Paolo Banchero",team:"ORL",pos:"F",value:22.6,id:1631094},
    {name:"Cade Cunningham",team:"DET",pos:"G",value:24.5,id:1630595},
    {name:"Darius Garland",team:"CLE",pos:"G",value:21.1,id:1629636},
    {name:"Kyrie Irving",team:"DAL",pos:"G",value:23.1,id:202681},
    {name:"Bradley Beal",team:"PHX",pos:"G",value:18.2,id:203078},
    {name:"Zion Williamson",team:"NOP",pos:"F",value:22.9,id:1629627},
    {name:"Julius Randle",team:"MIN",pos:"F",value:22.0,id:203944},
    {name:"De'Aaron Fox",team:"SAC",pos:"G",value:23.8,id:1628368},
    {name:"Pascal Siakam",team:"IND",pos:"F",value:21.3,id:1627783},
    {name:"OG Anunoby",team:"NYK",pos:"F",value:15.4,id:1628384},
    {name:"Jaren Jackson Jr.",team:"MEM",pos:"F-C",value:21.0,id:1628991},
    {name:"Jabari Smith Jr.",team:"HOU",pos:"F",value:15.3,id:1631109},
    {name:"Victor Wembanyama",team:"SAS",pos:"C",value:25.0,id:1641705},
    {name:"Scottie Barnes",team:"TOR",pos:"F",value:21.8,id:1630567},
    {name:"Brandon Ingram",team:"NOP",pos:"F",value:22.5,id:1627742},
    {name:"James Harden",team:"LAC",pos:"G",value:20.2,id:201935},
    {name:"Khris Middleton",team:"MIL",pos:"F",value:15.1,id:203114},
    {name:"Anthony Davis",team:"DAL",pos:"F-C",value:20.4,id:203076},
    {name:"Josh Giddey",team:"CHI",pos:"G-F",value:14.9,id:1630581},
    {name:"Evan Mobley",team:"CLE",pos:"F-C",value:18.0,id:1630596},
    {name:"Jaylen Brown",team:"BOS",pos:"G-F",value:22.7,id:1627759},
    {name:"Andrew Wiggins",team:"GSW",pos:"F",value:16.4,id:203952},
    {name:"Jimmy Butler",team:"MIA",pos:"F",value:20.8,id:202710},
    {name:"Paul George",team:"PHI",pos:"F",value:17.2,id:202331},
    {name:"Domantas Sabonis",team:"SAC",pos:"C",value:20.3,id:1627734},
    {name:"Kristaps Porzingis",team:"BOS",pos:"C",value:20.1,id:204001},
    {name:"Rudy Gobert",team:"MIN",pos:"C",value:14.0,id:203497},
    {name:"Ivica Zubac",team:"LAC",pos:"C",value:13.2,id:1627826},
    {name:"Fred VanVleet",team:"HOU",pos:"G",value:17.9,id:1627832},
    {name:"Chris Paul",team:"GSW",pos:"G",value:9.2,id:101108},
    {name:"Demar DeRozan",team:"CHI",pos:"F",value:18.0,id:201942},
    {name:"Kawhi Leonard",team:"LAC",pos:"F",value:14.1,id:202695},
  ],
  ast: [
    {name:"Trae Young",team:"ATL",pos:"G",value:11.0,id:1629027},
    {name:"Tyrese Haliburton",team:"IND",pos:"G",value:10.9,id:1630169},
    {name:"Nikola Jokic",team:"DEN",pos:"C",value:9.0,id:203999},
    {name:"LeBron James",team:"LAL",pos:"F",value:9.2,id:2544},
    {name:"Luka Doncic",team:"LAL",pos:"G-F",value:8.3,id:1629029},
    {name:"James Harden",team:"LAC",pos:"G",value:8.5,id:201935},
    {name:"Shai Gilgeous-Alexander",team:"OKC",pos:"G",value:6.4,id:1628983},
    {name:"Chris Paul",team:"GSW",pos:"G",value:7.8,id:101108},
    {name:"Dejounte Murray",team:"ATL",pos:"G",value:6.0,id:1627749},
    {name:"Mike Conley",team:"MIN",pos:"G",value:5.9,id:201144},
    {name:"Cade Cunningham",team:"DET",pos:"G",value:8.4,id:1630595},
    {name:"Darius Garland",team:"CLE",pos:"G",value:6.9,id:1629636},
    {name:"Kyrie Irving",team:"DAL",pos:"G",value:5.2,id:202681},
    {name:"Jalen Brunson",team:"NYK",pos:"G",value:7.7,id:1628973},
    {name:"De'Aaron Fox",team:"SAC",pos:"G",value:5.6,id:1628368},
    {name:"Damian Lillard",team:"MIL",pos:"G",value:7.4,id:203081},
    {name:"Stephen Curry",team:"GSW",pos:"G",value:4.7,id:201939},
    {name:"Giannis Antetokounmpo",team:"MIL",pos:"F",value:5.4,id:203507},
    {name:"Jayson Tatum",team:"BOS",pos:"F",value:5.3,id:1628369},
    {name:"Scottie Barnes",team:"TOR",pos:"F",value:5.9,id:1630567},
    {name:"Fred VanVleet",team:"HOU",pos:"G",value:6.3,id:1627832},
    {name:"Josh Giddey",team:"CHI",pos:"G-F",value:6.2,id:1630581},
    {name:"Pascal Siakam",team:"IND",pos:"F",value:4.5,id:1627783},
    {name:"Donovan Mitchell",team:"CLE",pos:"G",value:5.7,id:1628378},
    {name:"Kevin Durant",team:"PHX",pos:"F",value:4.2,id:201142},
    {name:"Paolo Banchero",team:"ORL",pos:"F",value:5.4,id:1631094},
    {name:"Anthony Edwards",team:"MIN",pos:"G",value:3.7,id:1630162},
    {name:"Julius Randle",team:"MIN",pos:"F",value:5.1,id:203944},
    {name:"Zion Williamson",team:"NOP",pos:"F",value:4.9,id:1629627},
    {name:"Brandon Ingram",team:"NOP",pos:"F",value:5.1,id:1627742},
    {name:"Victor Wembanyama",team:"SAS",pos:"C",value:3.1,id:1641705},
    {name:"Domantas Sabonis",team:"SAC",pos:"C",value:8.4,id:1627734},
    {name:"Alperen Sengun",team:"HOU",pos:"C",value:5.6,id:1630578},
    {name:"LaMelo Ball",team:"CHA",pos:"G",value:8.0,id:1630163},
    {name:"Russell Westbrook",team:"LAC",pos:"G",value:7.5,id:201566},
    {name:"Kawhi Leonard",team:"LAC",pos:"F",value:3.6,id:202695},
    {name:"Jaylen Brown",team:"BOS",pos:"G-F",value:3.5,id:1627759},
    {name:"Anthony Davis",team:"DAL",pos:"F-C",value:2.8,id:203076},
    {name:"Karl-Anthony Towns",team:"NYK",pos:"C",value:3.4,id:1626157},
    {name:"Evan Mobley",team:"CLE",pos:"F-C",value:3.2,id:1630596},
    {name:"Jaren Jackson Jr.",team:"MEM",pos:"F-C",value:2.0,id:1628991},
    {name:"Rudy Gobert",team:"MIN",pos:"C",value:1.6,id:203497},
    {name:"Bam Adebayo",team:"MIA",pos:"C",value:4.8,id:1628389},
    {name:"Nikola Vucevic",team:"CHI",pos:"C",value:3.2,id:202696},
    {name:"Demar DeRozan",team:"CHI",pos:"F",value:5.1,id:201942},
    {name:"Devin Booker",team:"PHX",pos:"G",value:4.5,id:1626164},
    {name:"Jimmy Butler",team:"MIA",pos:"F",value:4.9,id:202710},
    {name:"Bradley Beal",team:"PHX",pos:"G",value:4.1,id:203078},
    {name:"Paul George",team:"PHI",pos:"F",value:3.5,id:202331},
    {name:"OG Anunoby",team:"NYK",pos:"F",value:1.5,id:1628384},
  ],
  reb: [
    {name:"Domantas Sabonis",team:"SAC",pos:"C",value:14.4,id:1627734},
    {name:"Nikola Jokic",team:"DEN",pos:"C",value:12.9,id:203999},
    {name:"Rudy Gobert",team:"MIN",pos:"C",value:12.9,id:203497},
    {name:"Anthony Davis",team:"DAL",pos:"F-C",value:11.1,id:203076},
    {name:"Giannis Antetokounmpo",team:"MIL",pos:"F",value:11.9,id:203507},
    {name:"Jarrett Allen",team:"CLE",pos:"C",value:10.5,id:1628386},
    {name:"Bam Adebayo",team:"MIA",pos:"C",value:10.4,id:1628389},
    {name:"Victor Wembanyama",team:"SAS",pos:"C",value:11.5,id:1641705},
    {name:"Evan Mobley",team:"CLE",pos:"F-C",value:9.4,id:1630596},
    {name:"Alperen Sengun",team:"HOU",pos:"C",value:9.4,id:1630578},
    {name:"Karl-Anthony Towns",team:"NYK",pos:"C",value:8.3,id:1626157},
    {name:"Jayson Tatum",team:"BOS",pos:"F",value:10.0,id:1628369},
    {name:"LeBron James",team:"LAL",pos:"F",value:6.1,id:2544},
    {name:"Zion Williamson",team:"NOP",pos:"F",value:6.4,id:1629627},
    {name:"Julius Randle",team:"MIN",pos:"F",value:9.7,id:203944},
    {name:"Pascal Siakam",team:"IND",pos:"F",value:6.4,id:1627783},
    {name:"Kristaps Porzingis",team:"BOS",pos:"C",value:7.0,id:204001},
    {name:"Nikola Vucevic",team:"CHI",pos:"C",value:11.0,id:202696},
    {name:"Luka Doncic",team:"LAL",pos:"G-F",value:7.7,id:1629029},
    {name:"Scottie Barnes",team:"TOR",pos:"F",value:7.8,id:1630567},
    {name:"Jaren Jackson Jr.",team:"MEM",pos:"F-C",value:5.8,id:1628991},
    {name:"Paolo Banchero",team:"ORL",pos:"F",value:6.4,id:1631094},
    {name:"Chet Holmgren",team:"OKC",pos:"C",value:7.0,id:1631096},
    {name:"Brandon Ingram",team:"NOP",pos:"F",value:5.0,id:1627742},
    {name:"Jalen Brunson",team:"NYK",pos:"G",value:3.6,id:1628973},
    {name:"Donovan Mitchell",team:"CLE",pos:"G",value:4.5,id:1628378},
    {name:"Kevin Durant",team:"PHX",pos:"F",value:6.6,id:201142},
    {name:"Anthony Edwards",team:"MIN",pos:"G",value:5.0,id:1630162},
    {name:"Jabari Smith Jr.",team:"HOU",pos:"F",value:7.0,id:1631109},
    {name:"Walker Kessler",team:"UTA",pos:"C",value:9.0,id:1631117},
    {name:"Brook Lopez",team:"MIL",pos:"C",value:5.4,id:201572},
    {name:"Myles Turner",team:"IND",pos:"C",value:6.3,id:1626167},
    {name:"Nic Claxton",team:"BKN",pos:"C",value:8.4,id:1629651},
    {name:"Mitchell Robinson",team:"NYK",pos:"C",value:8.0,id:1629011},
    {name:"Deandre Ayton",team:"POR",pos:"C",value:9.2,id:1629028},
    {name:"Isaiah Stewart",team:"DET",pos:"C",value:7.1,id:1630191},
    {name:"Bobby Portis",team:"MIL",pos:"F",value:8.8,id:1626171},
    {name:"Daniel Gafford",team:"DAL",pos:"C",value:6.3,id:1629655},
    {name:"Ivica Zubac",team:"LAC",pos:"C",value:9.4,id:1627826},
    {name:"Jakob Poeltl",team:"TOR",pos:"C",value:7.7,id:1627751},
    {name:"Demar DeRozan",team:"CHI",pos:"F",value:4.9,id:201942},
    {name:"Jimmy Butler",team:"MIA",pos:"F",value:5.5,id:202710},
    {name:"Paul George",team:"PHI",pos:"F",value:5.3,id:202331},
    {name:"Kawhi Leonard",team:"LAC",pos:"F",value:6.3,id:202695},
    {name:"Stephen Curry",team:"GSW",pos:"G",value:3.6,id:201939},
    {name:"Grayson Allen",team:"PHX",pos:"G",value:3.9,id:1628960},
    {name:"OG Anunoby",team:"NYK",pos:"F",value:4.5,id:1628384},
    {name:"Andrew Wiggins",team:"GSW",pos:"F",value:4.3,id:203952},
    {name:"Al Horford",team:"BOS",pos:"C",value:6.4,id:201143},
    {name:"Kevon Looney",team:"GSW",pos:"C",value:6.9,id:1626172},
  ],
  stl: [
    {name:"Dejounte Murray",team:"ATL",pos:"G",value:2.0,id:1627749},
    {name:"Shai Gilgeous-Alexander",team:"OKC",pos:"G",value:2.0,id:1628983},
    {name:"OG Anunoby",team:"NYK",pos:"F",value:1.9,id:1628384},
    {name:"Fred VanVleet",team:"HOU",pos:"G",value:1.7,id:1627832},
    {name:"Jimmy Butler",team:"MIA",pos:"F",value:1.6,id:202710},
    {name:"Kawhi Leonard",team:"LAC",pos:"F",value:1.6,id:202695},
    {name:"Jrue Holiday",team:"BOS",pos:"G",value:1.5,id:203200},
    {name:"De'Aaron Fox",team:"SAC",pos:"G",value:1.5,id:1628368},
    {name:"Chris Paul",team:"GSW",pos:"G",value:1.4,id:101108},
    {name:"LeBron James",team:"LAL",pos:"F",value:1.3,id:2544},
    {name:"Nikola Jokic",team:"DEN",pos:"C",value:1.4,id:203999},
    {name:"Anthony Edwards",team:"MIN",pos:"G",value:1.4,id:1630162},
    {name:"Scottie Barnes",team:"TOR",pos:"F",value:1.5,id:1630567},
    {name:"Draymond Green",team:"GSW",pos:"F",value:1.1,id:203110},
    {name:"Herbert Jones",team:"NOP",pos:"F",value:1.3,id:1630532},
    {name:"Giannis Antetokounmpo",team:"MIL",pos:"F",value:0.9,id:203507},
    {name:"Luka Doncic",team:"LAL",pos:"G-F",value:1.6,id:1629029},
    {name:"Trae Young",team:"ATL",pos:"G",value:1.7,id:1629027},
    {name:"Donovan Mitchell",team:"CLE",pos:"G",value:1.7,id:1628378},
    {name:"Victor Wembanyama",team:"SAS",pos:"C",value:1.0,id:1641705},
    {name:"Josh Giddey",team:"CHI",pos:"G-F",value:1.3,id:1630581},
    {name:"Jabari Smith Jr.",team:"HOU",pos:"F",value:1.1,id:1631109},
    {name:"Darius Garland",team:"CLE",pos:"G",value:1.3,id:1629636},
    {name:"Tyrese Haliburton",team:"IND",pos:"G",value:1.6,id:1630169},
    {name:"Cade Cunningham",team:"DET",pos:"G",value:1.6,id:1630595},
    {name:"Paolo Banchero",team:"ORL",pos:"F",value:1.2,id:1631094},
    {name:"Bam Adebayo",team:"MIA",pos:"C",value:1.1,id:1628389},
    {name:"Evan Mobley",team:"CLE",pos:"F-C",value:0.8,id:1630596},
    {name:"Domantas Sabonis",team:"SAC",pos:"C",value:0.7,id:1627734},
    {name:"Jaylen Brown",team:"BOS",pos:"G-F",value:1.1,id:1627759},
    {name:"Devin Booker",team:"PHX",pos:"G",value:1.1,id:1626164},
    {name:"Kevin Durant",team:"PHX",pos:"F",value:0.9,id:201142},
    {name:"Jayson Tatum",team:"BOS",pos:"F",value:1.4,id:1628369},
    {name:"Anthony Davis",team:"DAL",pos:"F-C",value:1.1,id:203076},
    {name:"Stephen Curry",team:"GSW",pos:"G",value:1.1,id:201939},
    {name:"Pascal Siakam",team:"IND",pos:"F",value:0.9,id:1627783},
    {name:"LaMelo Ball",team:"CHA",pos:"G",value:1.6,id:1630163},
    {name:"Damian Lillard",team:"MIL",pos:"G",value:0.9,id:203081},
    {name:"Jalen Brunson",team:"NYK",pos:"G",value:0.9,id:1628973},
    {name:"Jaren Jackson Jr.",team:"MEM",pos:"F-C",value:0.9,id:1628991},
    {name:"Karl-Anthony Towns",team:"NYK",pos:"C",value:0.6,id:1626157},
    {name:"Brandon Ingram",team:"NOP",pos:"F",value:0.9,id:1627742},
    {name:"Kyrie Irving",team:"DAL",pos:"G",value:1.2,id:202681},
    {name:"Khris Middleton",team:"MIL",pos:"F",value:0.9,id:203114},
    {name:"Julius Randle",team:"MIN",pos:"F",value:0.8,id:203944},
    {name:"Fred VanVleet",team:"HOU",pos:"G",value:1.7,id:1627832},
    {name:"De'Aaron Fox",team:"SAC",pos:"G",value:1.5,id:1628368},
    {name:"Paul George",team:"PHI",pos:"F",value:1.3,id:202331},
    {name:"Kawhi Leonard",team:"LAC",pos:"F",value:1.6,id:202695},
    {name:"Jimmy Butler",team:"MIA",pos:"F",value:1.6,id:202710},
  ],
  blk: [
    {name:"Victor Wembanyama",team:"SAS",pos:"C",value:3.6,id:1641705},
    {name:"Jaren Jackson Jr.",team:"MEM",pos:"F-C",value:2.5,id:1628991},
    {name:"Anthony Davis",team:"DAL",pos:"F-C",value:2.4,id:203076},
    {name:"Nic Claxton",team:"BKN",pos:"C",value:2.3,id:1629651},
    {name:"Walker Kessler",team:"UTA",pos:"C",value:2.3,id:1631117},
    {name:"Myles Turner",team:"IND",pos:"C",value:2.2,id:1626167},
    {name:"Brook Lopez",team:"MIL",pos:"C",value:2.0,id:201572},
    {name:"Alperen Sengun",team:"HOU",pos:"C",value:1.9,id:1630578},
    {name:"Evan Mobley",team:"CLE",pos:"F-C",value:1.7,id:1630596},
    {name:"Bam Adebayo",team:"MIA",pos:"C",value:1.1,id:1628389},
    {name:"Chet Holmgren",team:"OKC",pos:"C",value:2.0,id:1631096},
    {name:"Rudy Gobert",team:"MIN",pos:"C",value:2.1,id:203497},
    {name:"Daniel Gafford",team:"DAL",pos:"C",value:1.7,id:1629655},
    {name:"Giannis Antetokounmpo",team:"MIL",pos:"F",value:0.7,id:203507},
    {name:"Domantas Sabonis",team:"SAC",pos:"C",value:0.6,id:1627734},
    {name:"Nikola Jokic",team:"DEN",pos:"C",value:0.8,id:203999},
    {name:"Karl-Anthony Towns",team:"NYK",pos:"C",value:0.8,id:1626157},
    {name:"Jabari Smith Jr.",team:"HOU",pos:"F",value:1.0,id:1631109},
    {name:"OG Anunoby",team:"NYK",pos:"F",value:0.7,id:1628384},
    {name:"Scottie Barnes",team:"TOR",pos:"F",value:0.9,id:1630567},
    {name:"Luka Doncic",team:"LAL",pos:"G-F",value:0.5,id:1629029},
    {name:"Victor Wembanyama",team:"SAS",pos:"C",value:3.6,id:1641705},
    {name:"Jarrett Allen",team:"CLE",pos:"C",value:1.2,id:1628386},
    {name:"Mitchell Robinson",team:"NYK",pos:"C",value:1.5,id:1629011},
    {name:"Ivica Zubac",team:"LAC",pos:"C",value:1.0,id:1627826},
    {name:"Isaiah Stewart",team:"DET",pos:"C",value:0.9,id:1630191},
    {name:"Jakob Poeltl",team:"TOR",pos:"C",value:1.4,id:1627751},
    {name:"Deandre Ayton",team:"POR",pos:"C",value:1.0,id:1629028},
    {name:"Bobby Portis",team:"MIL",pos:"F",value:0.5,id:1626171},
    {name:"Kevin Durant",team:"PHX",pos:"F",value:1.1,id:201142},
    {name:"Kawhi Leonard",team:"LAC",pos:"F",value:0.5,id:202695},
    {name:"Jayson Tatum",team:"BOS",pos:"F",value:0.2,id:1628369},
    {name:"Anthony Edwards",team:"MIN",pos:"G",value:0.8,id:1630162},
    {name:"LeBron James",team:"LAL",pos:"F",value:0.6,id:2544},
    {name:"Stephen Curry",team:"GSW",pos:"G",value:0.4,id:201939},
    {name:"Jalen Brunson",team:"NYK",pos:"G",value:0.2,id:1628973},
    {name:"Shai Gilgeous-Alexander",team:"OKC",pos:"G",value:0.8,id:1628983},
    {name:"Paolo Banchero",team:"ORL",pos:"F",value:0.9,id:1631094},
    {name:"Zion Williamson",team:"NOP",pos:"F",value:0.6,id:1629627},
    {name:"Julius Randle",team:"MIN",pos:"F",value:0.5,id:203944},
    {name:"Pascal Siakam",team:"IND",pos:"F",value:0.5,id:1627783},
    {name:"Nikola Vucevic",team:"CHI",pos:"C",value:0.8,id:202696},
    {name:"Kristaps Porzingis",team:"BOS",pos:"C",value:1.4,id:204001},
    {name:"Al Horford",team:"BOS",pos:"C",value:0.9,id:201143},
    {name:"Kevon Looney",team:"GSW",pos:"C",value:0.5,id:1626172},
    {name:"Damian Lillard",team:"MIL",pos:"G",value:0.3,id:203081},
    {name:"Demar DeRozan",team:"CHI",pos:"F",value:0.3,id:201942},
    {name:"Jimmy Butler",team:"MIA",pos:"F",value:0.5,id:202710},
    {name:"Donovan Mitchell",team:"CLE",pos:"G",value:0.3,id:1628378},
    {name:"Trae Young",team:"ATL",pos:"G",value:0.1,id:1629027},
  ],
};

const ALL_TIME: any = {
  pts: [
    {name:"Kareem Abdul-Jabbar",pos:"C",value:24.6,era:"1969-89"},
    {name:"Karl Malone",pos:"F",value:25.0,era:"1985-04"},
    {name:"LeBron James",pos:"F",value:27.2,era:"2003-"},
    {name:"Kobe Bryant",pos:"G",value:25.0,era:"1996-16"},
    {name:"Michael Jordan",pos:"G",value:30.1,era:"1984-03"},
    {name:"Dirk Nowitzki",pos:"F",value:20.7,era:"1998-19"},
    {name:"Wilt Chamberlain",pos:"C",value:30.1,era:"1959-73"},
    {name:"Shaquille O'Neal",pos:"C",value:23.7,era:"1992-11"},
    {name:"Carmelo Anthony",pos:"F",value:22.5,era:"2003-22"},
    {name:"Moses Malone",pos:"C",value:20.3,era:"1974-95"},
    {name:"Oscar Robertson",pos:"G",value:25.7,era:"1960-74"},
    {name:"Dominique Wilkins",pos:"F",value:24.8,era:"1982-99"},
    {name:"Tim Duncan",pos:"F-C",value:19.0,era:"1997-16"},
    {name:"Kevin Durant",pos:"F",value:27.3,era:"2007-"},
    {name:"Elgin Baylor",pos:"F",value:27.4,era:"1958-72"},
    {name:"Jerry West",pos:"G",value:27.0,era:"1960-74"},
    {name:"Paul Pierce",pos:"F",value:19.7,era:"1998-17"},
    {name:"Dwyane Wade",pos:"G",value:22.0,era:"2003-19"},
    {name:"Ray Allen",pos:"G",value:18.9,era:"1996-14"},
    {name:"Patrick Ewing",pos:"C",value:21.0,era:"1985-02"},
  ],
  ast: [
    {name:"John Stockton",pos:"G",value:10.5,era:"1984-03"},
    {name:"Jason Kidd",pos:"G",value:8.7,era:"1994-13"},
    {name:"Steve Nash",pos:"G",value:8.5,era:"1996-14"},
    {name:"Mark Jackson",pos:"G",value:8.0,era:"1987-04"},
    {name:"Magic Johnson",pos:"G",value:11.2,era:"1979-96"},
    {name:"Oscar Robertson",pos:"G",value:9.5,era:"1960-74"},
    {name:"Isiah Thomas",pos:"G",value:9.3,era:"1981-94"},
    {name:"LeBron James",pos:"F",value:7.4,era:"2003-"},
    {name:"Gary Payton",pos:"G",value:6.7,era:"1990-07"},
    {name:"Andre Miller",pos:"G",value:7.7,era:"1999-15"},
    {name:"Chris Paul",pos:"G",value:9.4,era:"2005-"},
    {name:"Rajon Rondo",pos:"G",value:8.0,era:"2006-21"},
    {name:"Tony Parker",pos:"G",value:5.6,era:"2001-19"},
    {name:"Russell Westbrook",pos:"G",value:8.5,era:"2008-"},
    {name:"Bob Cousy",pos:"G",value:7.5,era:"1950-70"},
    {name:"Rod Strickland",pos:"G",value:7.3,era:"1988-05"},
    {name:"Deron Williams",pos:"G",value:8.0,era:"2005-16"},
    {name:"Stephon Marbury",pos:"G",value:7.6,era:"1996-09"},
    {name:"Kevin Johnson",pos:"G",value:9.1,era:"1987-00"},
    {name:"Fat Lever",pos:"G",value:6.7,era:"1982-94"},
  ],
  reb: [
    {name:"Wilt Chamberlain",pos:"C",value:22.9,era:"1959-73"},
    {name:"Bill Russell",pos:"C",value:22.5,era:"1956-69"},
    {name:"Bob Pettit",pos:"F",value:16.2,era:"1954-65"},
    {name:"Jerry Lucas",pos:"F",value:15.6,era:"1963-74"},
    {name:"Nate Thurmond",pos:"C",value:15.0,era:"1963-77"},
    {name:"Bill Bridges",pos:"F",value:13.4,era:"1962-75"},
    {name:"Kareem Abdul-Jabbar",pos:"C",value:11.2,era:"1969-89"},
    {name:"Elgin Baylor",pos:"F",value:13.5,era:"1958-72"},
    {name:"Moses Malone",pos:"C",value:12.2,era:"1974-95"},
    {name:"Walt Bellamy",pos:"C",value:13.7,era:"1961-74"},
    {name:"Bob Lanier",pos:"C",value:10.1,era:"1970-84"},
    {name:"Charles Barkley",pos:"F",value:11.7,era:"1984-00"},
    {name:"Dennis Rodman",pos:"F",value:13.1,era:"1986-00"},
    {name:"Shaquille O'Neal",pos:"C",value:10.9,era:"1992-11"},
    {name:"Kevin Garnett",pos:"F-C",value:10.0,era:"1995-16"},
    {name:"Tim Duncan",pos:"F-C",value:10.8,era:"1997-16"},
    {name:"Dwight Howard",pos:"C",value:12.5,era:"2004-22"},
    {name:"Karl Malone",pos:"F",value:10.1,era:"1985-04"},
    {name:"Dave Cowens",pos:"C",value:13.6,era:"1970-83"},
    {name:"Larry Bird",pos:"F",value:10.0,era:"1979-92"},
  ],
  stl: [
    {name:"John Stockton",pos:"G",value:2.2,era:"1984-03"},
    {name:"Michael Jordan",pos:"G",value:2.3,era:"1984-03"},
    {name:"Chris Paul",pos:"G",value:2.1,era:"2005-"},
    {name:"Alvin Robertson",pos:"G",value:2.7,era:"1984-96"},
    {name:"Scottie Pippen",pos:"F",value:2.0,era:"1987-04"},
    {name:"Clyde Drexler",pos:"G",value:2.0,era:"1983-98"},
    {name:"Hakeem Olajuwon",pos:"C",value:1.7,era:"1984-02"},
    {name:"Jason Kidd",pos:"G",value:1.9,era:"1994-13"},
    {name:"Gary Payton",pos:"G",value:1.8,era:"1990-07"},
    {name:"LeBron James",pos:"F",value:1.6,era:"2003-"},
    {name:"Magic Johnson",pos:"G",value:1.9,era:"1979-96"},
    {name:"Larry Bird",pos:"F",value:1.7,era:"1979-92"},
    {name:"Kawhi Leonard",pos:"F",value:1.8,era:"2011-"},
    {name:"Dwyane Wade",pos:"G",value:1.5,era:"2003-19"},
    {name:"Maurice Cheeks",pos:"G",value:2.1,era:"1978-93"},
    {name:"Fat Lever",pos:"G",value:2.1,era:"1982-94"},
    {name:"Isaiah Thomas",pos:"G",value:1.9,era:"1981-94"},
    {name:"Kevin Durant",pos:"F",value:1.0,era:"2007-"},
    {name:"Russell Westbrook",pos:"G",value:1.6,era:"2008-"},
    {name:"Jimmy Butler",pos:"F",value:1.7,era:"2011-"},
  ],
  blk: [
    {name:"Mark Eaton",pos:"C",value:3.5,era:"1982-93"},
    {name:"Manute Bol",pos:"C",value:3.3,era:"1985-95"},
    {name:"Hakeem Olajuwon",pos:"C",value:3.1,era:"1984-02"},
    {name:"David Robinson",pos:"C",value:3.0,era:"1989-03"},
    {name:"Dikembe Mutombo",pos:"C",value:2.8,era:"1991-09"},
    {name:"Patrick Ewing",pos:"C",value:2.4,era:"1985-02"},
    {name:"Shaquille O'Neal",pos:"C",value:2.3,era:"1992-11"},
    {name:"Tim Duncan",pos:"F-C",value:2.2,era:"1997-16"},
    {name:"Tree Rollins",pos:"C",value:2.6,era:"1977-95"},
    {name:"Kareem Abdul-Jabbar",pos:"C",value:2.6,era:"1969-89"},
    {name:"Alonzo Mourning",pos:"C",value:2.8,era:"1992-08"},
    {name:"Elton Brand",pos:"F",value:2.0,era:"1999-13"},
    {name:"Kevin Garnett",pos:"F-C",value:1.4,era:"1995-16"},
    {name:"Serge Ibaka",pos:"F-C",value:2.1,era:"2009-22"},
    {name:"Larry Nance",pos:"F",value:2.1,era:"1981-94"},
    {name:"Dwight Howard",pos:"C",value:2.2,era:"2004-22"},
    {name:"Rudy Gobert",pos:"C",value:2.3,era:"2013-"},
    {name:"Joel Embiid",pos:"C",value:1.7,era:"2016-"},
    {name:"Jaren Jackson Jr.",pos:"F-C",value:2.5,era:"2018-"},
    {name:"Victor Wembanyama",pos:"C",value:3.6,era:"2023-"},
  ],
};

export default function NBAPage() {
  const [activeStat, setActiveStat] = useState("pts");
  const [era, setEra] = useState<"current"|"alltime">("current");
  const [posFilter, setPosFilter] = useState("All");

  const POSITIONS = ["All","G","F","C","G-F","F-C"];

  const posMatch = (pos: string, filter: string) => {
    if (filter === "All") return true;
    if (!pos) return false;
    return pos.includes(filter);
  };

  const data = era === "current" ? CURRENT_LEADERS[activeStat] : ALL_TIME[activeStat];
  const filtered = data?.filter((p:any) => posMatch(p.pos, posFilter)) || [];

  const medalColor = (i: number) => i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7c4c":"rgba(255,255,255,0.25)";

  return (
    <main style={{ minHeight:"100vh", background:"#0a0a0f" }}>
      <NavBar />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"40px 24px" }}>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8, background:"linear-gradient(135deg,#fff 60%,rgba(255,255,255,0.4))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>NBA Leaders</h1>
        <p style={{ color:"rgba(255,255,255,0.35)", marginBottom:24, fontSize:15 }}>Statistical leaders — season averages per game.</p>

        {/* Era toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <button onClick={()=>setEra("current")} style={{ padding:"8px 20px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:era==="current"?"#3B82F6":"rgba(255,255,255,0.06)", color:era==="current"?"#fff":"rgba(255,255,255,0.4)", border:"none" }}>2024-25 Season</button>
          <button onClick={()=>setEra("alltime")} style={{ padding:"8px 20px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", background:era==="alltime"?"#a78bfa":"rgba(255,255,255,0.06)", color:era==="alltime"?"#fff":"rgba(255,255,255,0.4)", border:"none" }}>All-Time Career</button>
        </div>

        {/* Stat category */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          {STAT_CATS.map(s=>(
            <button key={s.key} onClick={()=>setActiveStat(s.key)} style={{ padding:"7px 18px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer", background:activeStat===s.key?"#111118":"rgba(255,255,255,0.04)", color:activeStat===s.key?"#fff":"rgba(255,255,255,0.4)", border:activeStat===s.key?"1px solid rgba(255,255,255,0.15)":"1px solid transparent" }}>{s.label}</button>
          ))}
        </div>

        {/* Position filter */}
        <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
          {POSITIONS.map(p=>(
            <button key={p} onClick={()=>setPosFilter(p)} style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:500, cursor:"pointer", background:posFilter===p?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.04)", color:posFilter===p?"#60a5fa":"rgba(255,255,255,0.35)", border:posFilter===p?"1px solid rgba(59,130,246,0.4)":"1px solid rgba(255,255,255,0.06)" }}>{p}</button>
          ))}
        </div>

        <div style={{ background:"#111118", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>{era==="alltime"?"All-Time":"2024-25"} {STAT_CATS.find(s=>s.key===activeStat)?.label} Leaders</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>· {STAT_CATS.find(s=>s.key===activeStat)?.unit} · {filtered.length} players</span>
          </div>
          {filtered.map((p:any, i:number)=>(
            <div key={`${p.name}-${i}`} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.03)")}
              onMouseLeave={e=>(e.currentTarget.style.background="none")}>
              <span style={{ fontSize:18, fontWeight:800, minWidth:32, color:medalColor(i) }}>{i+1}</span>
              {era==="current" && p.id && (
                <img src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`}
                  onError={e=>{(e.target as HTMLImageElement).style.display="none"}}
                  style={{ width:44, height:33, objectFit:"cover", objectPosition:"top", borderRadius:8, flexShrink:0 }} />
              )}
              {era==="alltime" && (
                <div style={{ width:44, height:33, borderRadius:8, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>🏆</span>
                </div>
              )}
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{p.name}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:2 }}>
                  {p.pos} {p.era ? `· ${p.era}` : p.team ? `· ${p.team}` : ""}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:26, fontWeight:800, color:i===0?"#60a5fa":"#fff" }}>{p.value}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{STAT_CATS.find(s=>s.key===activeStat)?.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
