export interface Unit {
    characterId: string
    tier: number
    itemNames: string[]
}

export interface Trait {
    name: string
    numUnits: number
    tierCurrent: number
    tierTotal: number
}

export interface ParticipantSummary {
    puuid: string
    riotIdGameName: string
    riotIdTagLine: string
    placement: number
    level: number
    lastRound: number
    timeEliminated: number
    traits: Trait[]
    units: Unit[]
}

export interface MatchSummaryEntry extends ParticipantSummary {
    matchId: string
}

export interface RiotAccount {
    puuid: string
    gameName: string
    tagLine: string
}