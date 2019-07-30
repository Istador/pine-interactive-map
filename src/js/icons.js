const quest = {
  iconSize      : null,
  iconAnchor    : [  8,  8 ],
  popupAnchor   : [  0, -8 ],
  tooltipAnchor : [  0, -8 ],
}

module.exports = {
  icons: {
    default: {
      iconSize      : null,
      iconAnchor    : [  8,  8 ],
      popupAnchor   : [  0,  0 ],
      tooltipAnchor : [  0,  0 ],
    },
    entrance: {
      vault: quest,
    },
    item: {
      quest,
      equip: quest,
    },
    npc: {
      quest,
    },
    unique: {
      emblem: {
        iconSize      : null,
        iconAnchor    : [  8,  10 ],
        popupAnchor   : [  0, -10 ],
        tooltipAnchor : [  0, -10 ],
      },
      keygraphite: {
        iconSize      : null,
        iconAnchor    : [  5,  5 ],
        popupAnchor   : [  0, -5 ],
        tooltipAnchor : [  0, -5 ],
      },
      chest: {
        iconSize      : null,
        iconAnchor    : [  8,  5.5 ],
        popupAnchor   : [  0, -5.5 ],
        tooltipAnchor : [  0, -5.5 ],
      },
      idea: {
        iconSize      : null,
        iconAnchor    : [  8,  5.5 ],
        popupAnchor   : [  0, -5.5 ],
        tooltipAnchor : [  0, -5.5 ],
      },
    },
  },
}
