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
    permalink      : 'Permalink',
    styleTitle: {
      seen: {
        show : 'Erledigte Marker werden normal angezeigt',
        fade : 'Erledigte Marker werden schwächer angezeigt',
        hide : 'Erledigte Marker werden nicht angezeigt',
        only : 'Es werden nur erledigte Marker angezeigt',
      },
      unconfirmed: {
        show : 'Unbestätigte Marker werden normal angezeigt',
        red  : 'Unbestätigte Marker werden rot eingefärbt',
        hide : 'Unbestätigte Marker werden nicht angezeigt',
        only : 'Es werden nur unbestätigte Marker angezeigt',
      },
    },
  },
  properties: {
    type        : 'Kategorie',
    item        : 'Typ',
    item_id     : 'Item-ID',
    amount      : 'Anzahl',
    x           : 'X',
    y           : 'Y',
    z           : 'Z',
    area        : 'Bereich',
    title       : 'Bezeichnung',
    description : 'Beschreibung',
    source      : 'Quelle',
    confirmed   : 'Status',
  },
  names: {
    area: {
      '.' : 'Gebiet',
       1  : 'Heimat',
       2  : 'Keilwald',
       3  : 'Pollenfelder',
       4  : 'Küstenklippen',
       5  : 'Kargfelder',
       6  : 'Hohlgebirge',
       7  : 'Prachttal',
       8  : 'Bergrat',
       9  : 'Borealküsten',
      10  : 'Feuchtküsten',
      11  : 'Staubquellen',
      12  : 'Trockenschlucht',
      13  : 'Tunneldünen',
      14  : 'Trockenbucht',
      15  : 'Bergrücken',
      16  : 'Sumpfwald',
      17  : 'Nordplateaus',
      18  : 'Telkin-Pass',
      19  : 'Mt. Telkin',
      20  : 'Hochland-Bergrücken',
      21  : 'Fernwald',
    },
    entrance: {
      '.'        : 'Eingang',
      cave       : 'Höhle',
      mohlenhill : 'Mollerhügel', // Beta only
      vault      : 'Gruft',
    },
    food: {
      '.'             : 'Nahrung',
      alpafantmeat    : 'Alpafant-Fleisch',
      anurashroom     : 'Anura-Pilz',
      avianpepper     : 'Vogelpfeffer',
      bleekerthigh    : 'Schnapper-Oberschenkel',
      carrant         : 'Carrant',
      commonwheat     : 'Brotweizen',
      dunerice        : 'Dünenreis',
      edenfruit       : 'Edenfrucht', // Beta only
      fatplant        : 'Fettpflanze',
      leafdough       : 'Blattteig',
      meageryam       : 'Mageryams',
      mudbeet         : 'Schlammrübe',
      nuctus          : 'Nuctus',
      obergine        : 'Obergine',
      puffleegg       : 'Fluffi-Ei',
      ridgefennel     : 'Jochfenchel',
      roseberry       : 'Rosenbeere',
      telkinchives    : 'Telkin-Schnittlauch',
      tingflower      : 'Tingblume',
      waddletoothloin : 'Watschelzahn-Lende',
    },
    idea: {
      '.'    : 'Idee',
      chest  : 'Truhe',
      pickup : 'Aufhebbar',
      quest  : 'Quest',
    },
    item: {
      '.'        : 'Gegenstand',
      equip      : 'Ausrüstung',
      outfinding : 'Äußerfund',
      quest      : 'Quest',
    },
    material: {
      '.'                : 'Material',
      alpafantleather    : 'Alpafant-Leder',
      beagalite          : 'Beagelit',
      bleekerantenna     : 'Schnapper-Antenne',
      crassbone          : 'Grobknochen',
      dryclay            : 'Trockenton',
      dullrock           : 'Stumpffels',
      grandcone          : 'Großzapfen',
      gravelmoss         : 'Schottermoos',
      leaniron           : 'Dünneisen',
      lunarodos          : 'Lunarodos',
      marrwood           : 'Marrholz',
      morrowhay          : 'Morgenheu',
      pufflefeather      : 'Fluffi-Feder',
      sandstone          : 'Sandstein',
      slickpearl         : 'Glattperle',
      softglass          : 'Weichglas',
      solfodil           : 'Solfodil',
      spystal            : 'Spystal',
      stiffrope          : 'Starrseil',
      stuffcloth         : 'Stofftuch',
      toothstone         : 'Zahnstein',
      waddletoothblubber : 'Watschelzahn-Speck',
    },
    mechanic: {
      '.'            : 'Mechanisch',
      door           : 'Tür',
      electrotrigger : 'Elektrischer Schalter',
      hittrigger     : 'Zielscheibe',
      lever          : 'Hebel',
      pinsocket      : 'Pin Socket',
    },
    nest: {
      '.'         : 'Nest',
      alpafant    : 'Alpafant',
      bleeker     : 'Schnapper',
      puffle      : 'Fluffi',
      waddletooth : 'Watschelzahn',
    },
    npc: {
      '.'      : 'NPC',
      chief    : 'Häuptling',
      merchant : 'Händler',
      quest    : 'Quest',
      village  : 'Dorf',
    },
    spawn: {
      '.'         : 'Kreaturen',
      alpafant    : 'Alpafant',
      bleeker     : 'Schnapper',
      puffle      : 'Fluffi',
      waddletooth : 'Watschelzahn',
    },
    unique: {
      '.'          : 'Einzigartig',
      amphiscusorb : 'Amphiscus-Kugel',
      journal      : 'Journal / Buch',
      keygraphite  : 'Schlüsselgraphit',
    },
  },
}
