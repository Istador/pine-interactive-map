module.exports = {
  ui: {
    title          : 'Map interactif de Pine',
    zoom_in        : 'Zoomer',
    zoom_out       : 'Dézoomer',
    fullscreen_on  : 'Plein écran',
    fullscreen_off : 'Quitter le mode plein écran',
    datasource     : 'Contribuer',
    mark_seen      : 'Marquer comme étant terminé.',
    unmark_seen    : 'Retirer le marquage.',
    permalink      : 'Permalien',
    styleTitle: {
      seen: {
        show : 'Les éléments marqués terminés sont affichés normalement.',
        fade : 'Les éléments marqués terminés sont atténués par une légère transparence.',
        hide : 'Les éléments marqués terminés sont cachés.',
        only : 'Seuls les éléments marqués terminés sont affichés.',
      },
      unconfirmed: {
        show : 'Les éléments non-vérifiés sont affichés normalement.',
        red  : 'Les éléments non-vérifiés sont colorés en rouge.',
        hide : 'Les éléments non-vérifiés sont cachés.',
        only : 'Seuls les éléments non-vérifiés sont affichés.',
      },
    },
  },
  properties: {
    type        : 'Catégorie',
    item        : 'Nom',
    item_id     : 'ID de l\'élément',
    amount      : 'Quantité',
    x           : 'X',
    y           : 'Y',
    z           : 'Z',
    area        : 'Zone',
    title       : 'Nom',
    description : 'Description',
    source      : 'Source',
    confirmed   : 'Statut',
  },
  names: {
    area: {
      '.' : 'Zone',
       1  : 'Falaises Instables',
       2  : 'Bois du Coin',
       3  : 'Champs de Pollen',
       4  : 'Falaises Côtières',
       5  : 'Champs Clairsemés',
       6  : 'Montagnes Concaves',
       7  : 'Grande Vallée',
       8  : 'Crête Etroite',
       9  : 'Côtes Boréales',
      10  : 'Rivages Humides',
      11  : 'Sources Poussiéreuses',
      12  : 'Canyon Aride',
      13  : 'Dunes de Tunnel',
      14  : 'Baie Sèche',
      15  : 'Bords de Crête',
      16  : 'Bois Innondés',
      17  : 'Plateaux du Nord',
      18  : 'Passage de Telkin',
      19  : 'Mont Telkin',
      20  : 'Grande Crête',
      21  : 'Bois Eloignés',
    },
    entrance: {
      '.'        : 'Entrée',
      cave       : 'Grotte',
      mohlenhill : 'Coline de Mohlen', // Beta only
      vault      : 'Voûte',
    },
    food: {
      '.'             : 'Aliment',
      alpafantmeat    : 'Viande de Alpafant',
      anurashroom     : 'Champi Anura',
      avianpepper     : 'Poivre d\'Avian',
      bleekerthigh    : 'Cuisse de Bleeker',
      carrant         : 'Carseille',
      commonwheat     : 'Blé Commun',
      dunerice        : 'Riz de Dune',
      edenfruit       : 'Fruit d\'Eden', // Beta only
      fatplant        : 'Grotiron',
      leafdough       : 'Pâte Feuilletée',
      meageryam       : 'Patate Maigre',
      mudbeet         : 'Betterave de Boue',
      nuctus          : 'Nuctus',
      obergine        : 'Hobergine',
      puffleegg       : 'Oeufs de Puffle',
      ridgefennel     : 'Fenouil de Crête',
      roseberry       : 'Baie Rose',
      telkinchives    : 'Ciboulette de Telkin',
      tingflower      : 'Fleur d\'Acmella',
      waddletoothloin : 'Longe de Waddletooth',
    },
    idea: {
      '.'    : 'Idée',
      chest  : 'Coffre',
      pickup : 'À ramasser',
      quest  : 'Quête',
    },
    item: {
      '.'        : 'Objet',
      equip      : 'Équipement',
      outfinding : 'Horsvention',
      quest      : 'Quête',
    },
    material: {
      '.'                : 'Matériel',
      alpafantleather    : 'Cuir de Alpafant',
      beagalite          : 'Beagalite',
      bleekerantenna     : 'Antenne de Bleeker',
      crassbone          : 'Os Commun',
      dryclay            : 'Argile Sèche',
      dullrock           : 'Pierre de Dull',
      grandcone          : 'Grand Cône',
      gravelmoss         : 'Mousse de Gravier',
      leaniron           : 'Fer Tendre',
      lunarodos          : 'Bois Nocturne',
      marrwood           : 'Bois de Marr',
      morrowhay          : 'Foin Doux',
      pufflefeather      : 'Plume de Puffle',
      sandstone          : 'Grès de Sable',
      slickpearl         : 'Perle Mirroir',
      softglass          : 'Verre Poli',
      solfodil           : 'Rayon de Glace',
      spystal            : 'Crachtal',
      stiffrope          : 'Corde de Bois',
      stuffcloth         : 'Tissu Souple',
      toothstone         : 'Pierre de Dents',
      waddletoothblubber : 'Gelée de Waddletooth',
    },
    mechanic: {
      '.'            : 'Mécanique',
      door           : 'Porte',
      electrotrigger : 'Déclencheur électrique',
      hittrigger     : 'Déclencheur Normal',
      lever          : 'Levier',
      pinsocket      : 'Prises de broche', // ??? check in-game name
    },
    nest: {
      '.'         : 'Nid',
      alpafant    : 'Alpafant',
      bleeker     : 'Bleeker',
      puffle      : 'Puffle',
      waddletooth : 'Waddletooth',
    },
    npc: {
      '.'      : 'PNJ', // or « Personnages non-joueurs »
      chief    : 'Chef',
      merchant : 'Marchant',
      quest    : 'Quêtes',
      village  : 'Village',
    },
    spawn: {
      '.'         : 'Point d\'apparition',
      alpafant    : 'Alpafant',
      bleeker     : 'Bleeker',
      puffle      : 'Puffle',
      waddletooth : 'Waddletooth',
    },
    unique: {
      '.'          : 'Objet unique',
      amphiscusorb : 'Orbes',
      journal      : 'Journal / Livre',
      keygraphite  : 'Graphite de Clé',
    },
  },
}
