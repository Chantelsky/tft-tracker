import { ref } from 'vue'

const championImages = ref<Record<string, string>>({})
const version = ref<string | null>(null)
let loaded = false

const CURRENT_SET = 'TFTSet17'

async function loadDataDragon() {
  if (loaded) return
  loaded = true

  const versions = await fetch(
    'https://ddragon.leagueoflegends.com/api/versions.json'
  ).then((r) => r.json())
  version.value = versions[0]

  const data = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/tftchampions-teamplanner.json'
  ).then((r) => r.json())

  const champions = data[CURRENT_SET] || []
  const map: Record<string, string> = {}

  for (const champ of champions) {
    const path = champ.squareIconPath
      .replace('/lol-game-data/assets/', '')
      .toLowerCase()
    map[champ.character_id] =
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${path}`
  }

  championImages.value = map
}

export function useDataDragon() {
  return { championImages, version, loadDataDragon }
}
