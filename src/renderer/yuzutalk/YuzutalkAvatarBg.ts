import Character from "../../model/Character";

const idToImage = new Map([
  ["Shun", "CH0066"],
  ["hatsune_miku", "CH9999"],
  ["npc_fisherman", "FishingVillage2"],
  ["Saya", "Saya"],
]);

const imageNameToImage = new Map([
  ["bunnygirl", "BunnyGirl"],
  ["cheer", "Cheerleading"],
  ["newyear", "Newyear"],
  ["ridingsuit", "Ridingsuit"],
  ["swimsuit", "Swimsuit"],

  ["CH0217", "FishingVillage2"],
]);

const clubToImage = new Map([
  ["rabbit_platoon", "CampSite"],
  ["onsen_development_club", "Onsen"],

  // TODO: use these properly
  ["BigPlaza", "BigPlaza"],
  ["FrozenSea", "FrozenSea"],
  ["GehennaPartyRoom", "GehennaPartyRoom"],
  ["Holiday", "Holiday"],
  ["HyakkiyakoTreeSquare", "HyakkiyakoTreeSquare"],
  ["OldHouseOutside", "OldHouseOutside"],
  ["OperaHouse", "OperaHouse"],
  ["PracticeRoom", "PracticeRoom"],
  ["Swimsuit02", "Swimsuit02"],
  ["Swimsuit03", "Swimsuit03"],
]);

const schoolToImage = new Map([
  ["abydos", "Abydos"],
  ["arius", "Arius"],
  ["gehenna", "Gehenna"],
  ["hyakkiyako", "Hyakkiyako"],
  ["millennium", "Millennium"],
  ["red_winter", "Redwinter"],
  ["srt", "SRT"],
  ["shanhaijing", "Sanhaijing"],
  ["trinity", "Trinity"],
  ["valkyrie", "Valkyrie"],
]);

export function getAvatarBg(char: Character, img: string) {
  if (idToImage.has(char.id)) {
    return idToImage.get(char.id)!;
  }

  const imgKey = img.split("_").slice(-1)[0];
  if (imageNameToImage.has(imgKey)) {
    return imageNameToImage.get(imgKey)!;
  }

  for (const s of char.searches) {
    if (clubToImage.has(s)) {
      return clubToImage.get(s)!;
    }
    if (schoolToImage.has(s)) {
      return schoolToImage.get(s)!;
    }
  }

  return "Millennium";
}
