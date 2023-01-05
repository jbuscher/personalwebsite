import { Route } from "@angular/router";

export interface PostListing {
    date: string;
    title: string;
    iconPath: string;
    route: Route;
    tags: string[];
}

export interface L2mRow {
    _id: string;
    gameId: string;
    seasonType: string;
    nbaData: L2mGameData;
}

export interface L2mGameData {
    game: L2mGame[];
    stats: L2mStats[];
    l2m: L2m[];
}

export interface L2mGame {
    Home_team: string;
    Away_team: string;
    GameId: string;
    HomeTeamScore: number;
    VisitorTeamScore: number;
    GameDate: string;
    HomeTeamId: number;
    AwayTeamId: number;
    Home_team_abbr: string;
    Away_team_abbr: string;
    L2M_Comments: string|null;
    GameDayOut: string;
}

export interface L2mStats {
    stats_name: string;
    home: number;
    away:number;
}

export interface L2m {
    PeriodName: string;
    PCTime: string;
    ImposibleIndicator: number;
    Comment: string | null;
    CallRatingName: string;
    CallType: string;
    CP: string | null;
    DP: string | null;
    Difficulty: string;
    VideolLink: string;
    Qualifier: string | null;
    posID: string;
    posStart: string;
    posEnd: string;
    teamIdInFavor: null;
    errorInFavor: String;
    imgChart: number;
}

export interface NbaTeamData {
    _ie: string | null;
    id: string | null;
    abbreviation: string | null;
    city: string | null;
    conference: string | null;
    division: string | null;
    full_name: string | null;
    name: string | null;
}