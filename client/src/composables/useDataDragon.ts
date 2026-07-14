import { ref } from 'vue'

const championImages = ref<Record<string, string>>({})
const traitImages = ref<Record<string, string>>({})
const traitNames = ref<Record<string, string>>({})
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

  const champData = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/tftchampions-teamplanner.json'
  ).then((r) => r.json())

  const champions = champData[CURRENT_SET] || []
  const champMap: Record<string, string> = {}
  for (const champ of champions) {
    const path = champ.squareIconPath
      .replace('/lol-game-data/assets/', '')
      .toLowerCase()
    champMap[champ.character_id] =
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${path}`
  }
  championImages.value = champMap

  const traitData = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/tfttraits.json'
  ).then((r) => r.json())

  const traitMap: Record<string, string> = {}
  const nameMap: Record<string, string> = {}
  for (const trait of traitData) {
    if (trait.set !== CURRENT_SET) continue
    const path = trait.icon_path
      .replace('/lol-game-data/assets/', '')
      .toLowerCase()
    traitMap[trait.trait_id] =
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${path}`
    nameMap[trait.trait_id] = trait.display_name
  }
  traitImages.value = traitMap
  traitNames.value = nameMap
}

export function useDataDragon() {
  return { championImages, traitImages, traitNames, version, loadDataDragon }
}
