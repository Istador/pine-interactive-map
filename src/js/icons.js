const quest = {
  iconSize      : null,
  iconAnchor    : [ 8,  8 ],
  popupAnchor   : [ 0, -8 ],
  tooltipAnchor : [ 0, -8 ],
}

const stone = {
  iconSize      : null,
  iconAnchor    : [ 8,    8 ],
  popupAnchor   : [ 3.5, -8 ],
  tooltipAnchor : [ 3.5, -8 ],
}

module.exports = {
  icons: {
    default: {
      iconSize      : null,
      iconAnchor    : [ 8, 8 ],
      popupAnchor   : [ 0, 0 ],
      tooltipAnchor : [ 0, 0 ],
    },
    entrance: {
      default: {
        iconSize      : null,
        iconAnchor    : [ 8,  6.5 ],
        popupAnchor   : [ 0, -6.5 ],
        tooltipAnchor : [ 0, -6.5 ],
      },
      vault: quest,
    },
    food: {
      default: {
        iconSize      : null,
        iconAnchor    : [  8,  8 ],
        popupAnchor   : [ -8, -8 ],
        tooltipAnchor : [ -8, -8 ],
      },
    },
    item: {
      default: {
        iconSize      : null,
        iconAnchor    : [ 9,  7.8 ],
        popupAnchor   : [ 0, -7.8 ],
        tooltipAnchor : [ 0, -7.8 ],
      },
      quest,
    },
    material: {
      default: {
        iconSize      : null,
        iconAnchor    : [ 8,    6.75 ],
        popupAnchor   : [ 1.5, -6.75 ],
        tooltipAnchor : [ 1.5, -6.75 ],
      },
      beagalite: stone,
      dullrock: stone,
      gravelmoss: {
        iconSize      : null,
        iconAnchor    : [ 7,  8 ],
        popupAnchor   : [ 4, -8 ],
        tooltipAnchor : [ 4, -8 ],
      },
      leaniron: stone,
      lunarodos: {
        iconSize      : null,
        iconAnchor    : [ 8,  8 ],
        popupAnchor   : [ 0, -8 ],
        tooltipAnchor : [ 0, -8 ],
      },
      sandstone: stone,
      spystal: {
        iconSize      : null,
        iconAnchor    : [ 5.6,  8 ],
        popupAnchor   : [ 2.8, -8 ],
        tooltipAnchor : [ 2.8, -8 ],
      },
      toothstone: stone,
    },
    mechanic: {
      default: {
        iconSize      : null,
        iconAnchor    : [ 8,  8 ],
        popupAnchor   : [ 0, -8 ],
        tooltipAnchor : [ 0, -8 ],
      },
    },
    nest: {
      default: {
        iconSize      : null,
        iconAnchor    : [ 8,  8 ],
        popupAnchor   : [ 0, -8 ],
        tooltipAnchor : [ 0, -8 ],
      },
    },
    npc: {
      quest,
    },
    unique: {
      chest: {
        iconSize      : null,
        iconAnchor    : [ 8,  5.5 ],
        popupAnchor   : [ 0, -5.5 ],
        tooltipAnchor : [ 0, -5.5 ],
      },
      emblem: {
        iconSize      : null,
        iconAnchor    : [ 8,  10 ],
        popupAnchor   : [ 0, -10 ],
        tooltipAnchor : [ 0, -10 ],
      },
      idea: {
        iconSize      : null,
        iconAnchor    : [ 8,  5.5 ],
        popupAnchor   : [ 0, -5.5 ],
        tooltipAnchor : [ 0, -5.5 ],
      },
      journal: {
        iconSize      : null,
        iconAnchor    : [ 7,  8 ],
        popupAnchor   : [ 0, -8 ],
        tooltipAnchor : [ 0, -8 ],
      },
      keygraphite: {
        iconSize      : null,
        iconAnchor    : [ 5,  5 ],
        popupAnchor   : [ 0, -5 ],
        tooltipAnchor : [ 0, -5 ],
      },
    },
  },
}
