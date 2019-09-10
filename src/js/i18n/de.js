module.exports = {
  ui: {
    title          : 'Pine Interaktive Karte',
    zoom_in        : 'Hereinzoomen',
    zoom_out       : 'Herauszoomen',
    fullscreen_on  : 'Vollbild',
    fullscreen_off : 'Vollbild beenden',
    datasource     : 'Beitragen',
    mark_seen      : 'Als erledigt markieren',
    unmark_seen    : 'Als unerledigt markieren',
    styleTitle: {
      seen: {
        show: 'Erledigte Marker werden normal angezeigt',
        fade: 'Erledigte Marker werden schwächer angezeigt',
        hide: 'Erledigte Marker werden nicht angezeigt',
        only: 'Es werden nur erledigte Marker angezeigt',
      },
      unconfirmed: {
        show: 'Unbestätigte Marker werden normal angezeigt',
        red:  'Unbestätigte Marker werden rot eingefärbt',
        hide: 'Unbestätigte Marker werden nicht angezeigt',
        only: 'Es werden nur unbestätigte Marker angezeigt',
      },
    },
  },
  properties: {
    type        : 'Kategorie',
    item        : 'Typ',
    amount      : 'Anzahl',
    area        : 'Bereich',
    title       : 'Bezeichnung',
    description : 'Beschreibung',
    source      : 'Quelle',
  },
  names: {
    entrance: {
      '.'    : 'Eingang',
      'cave' : 'Höhle',
    },
    food: {
      '.' : 'Essen',
    },
    item: {
      '.'   : 'Gegenstand',
      equip : 'Ausrüstung',
    },
    material: {
      '.' : 'Material',
    },
    mechanic: {
      '.'   : 'Mechanisch',
      door  : 'Tür',
      lever : 'Hebel',
    },
    nest: {
      '.' : 'Nest',
    },
    npc: {
      '.'      : 'NPC',
      chief    : 'Häuptling',
      merchant : 'Händler',
    },
    unique: {
      '.'     : 'Einzigartig',
      chest   : 'Truhe',
      idea    : 'Idee',
      journal : 'Journal / Buch',
    },
  },
}
