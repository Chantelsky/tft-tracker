export const REGION_MAP: Record<
  string,
  { account: string; match: string; platform: string }
> = {
  NA: { account: "americas", match: "americas", platform: "na1" },
  BR: { account: "americas", match: "americas", platform: "br1" },
  LAN: { account: "americas", match: "americas", platform: "la1" },
  LAS: { account: "americas", match: "americas", platform: "la2" },
  EUW: { account: "europe", match: "europe", platform: "euw1" },
  EUNE: { account: "europe", match: "europe", platform: "eun1" },
  TR: { account: "europe", match: "europe", platform: "tr1" },
  RU: { account: "europe", match: "europe", platform: "ru" },
  KR: { account: "asia", match: "asia", platform: "kr" },
  JP: { account: "asia", match: "asia", platform: "jp1" },
  OCE: { account: "asia", match: "sea", platform: "oc1" },
};
