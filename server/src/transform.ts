import type { ParticipantSummary } from './types.js'

export function transformMatch(rawMatch: any): ParticipantSummary[] {
    return rawMatch.info.participants.map((p: any) => ({
        puuid: p.puuid,
        riotIdGameName: p.riotIdGameName,
        riotIdTagLine: p.riotIdTagline,
        placement: p.placement,
        level: p.level,
        lastRound: p.last_round,
        timeEliminated: p.time_eliminated,
        units: p.units.map((u: any) => ({
            characterId: u.character_id,
            tier: u.tier,
            itemNames: u.itemNames,
        })),
        traits: p.traits
            .filter((t: any) => t.tier_current > 0)
            .map((t: any) => ({
                name: t.name,
                numUnits: t.num_units,
                tierCurrent: t.tier_current,
                tierTotal: t.tier_total,
            })),
    }));
}