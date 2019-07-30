const capitalize = (name) => name.split(/[ \._\-]/).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')

const type2name = (type) => (type in names ? names[type]['.'] : capitalize(type))

const item2name = (type) => (item) => (type in names && item in names[type] ? names[type][item] : capitalize(item))

const names = {
  entrance: {
    '.'        : 'Entrance',
    cave       : 'Cave',
    mohlenhill : 'Mohlen Hill',
    vault      : 'Vault',
  },
  food: {
    '.'          : 'Food',
    anurashroom  : 'Anurashroom',
    avianpepper  : 'Avian Pepper',
    carrant      : 'Carrant',
    commonwheat  : 'Commonwheat',
    dunerice     : 'Dunerice',
    edenfruit    : 'Edenfruit',
    fatplant     : 'Fatplant',
    leafdough    : 'Leaf Dough',
    meageryam    : 'Meageryam',
    mudbeet      : 'Mudbeet',
    nuctus       : 'Nuctus',
    obergine     : 'Obergine',
    pufflegg     : 'Puffl Egg',
    roseberry    : 'Roseberry',
    telkinchives : 'Telkin Chives',
    tingflower   : 'Tingflower',
  },
  item: {
    '.'   : 'Item',
    equip : 'Equipment',
    quest : 'Quest',
  },
  material: {
    '.'             : 'Material',
    alpafantleather : 'Alpafant Leather',
    beagalite       : 'Beagalite',
    bleekerantenna  : 'Bleeker Antenna',
    dryclay         : 'Dryclay',
    dullrock        : 'Dullrock',
    grandcone       : 'Grandcone',
    gravelmoss      : 'Gravel Moss',
    leaniron        : 'Lean Iron',
    lunarodos       : 'Lunarodos',
    marrwood        : 'Marrwood',
    morrowhay       : 'Morrow Hay',
    pufflefeather   : 'Puffle Feather',
    sandstone       : 'Sandstone',
    slickpearl      : 'Slick Pearl',
    solfodil        : 'Solfodil',
    spystal         : 'Spystal',
    toothstone      : 'Toothstone',
  },
  mechanic: {
    '.'            : 'Mechanical',
    arrowtarget    : 'Arrow Target',
    door           : 'Door',
    electrotrigger : 'Electrical Trigger',
    lever          : 'Lever',
    pinsocket      : 'Pin Socket',
  },
  npc: {
    '.'      : 'NPC',
    chief    : 'Chief',
    merchant : 'Merchant',
    quest    : 'Quest',
  },
  unique: {
    '.'         : 'Unique',
    chest       : 'Chest',
    emblem      : 'Amphiscis Emblem',
    idea        : 'Idea',
    journal     : 'Journal / Book',
    keygraphite : 'Keygraphite',
  },
}

module.exports = {
  type2name,
  item2name,
}
