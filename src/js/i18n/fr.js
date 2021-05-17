module.exports = {
	ui: {
		title					: 'Map interactif de Pine',
		zoom_in					: 'Zoomer',
		zoom_out				: 'Dézoomer',
		fullscreen_on			: 'Plein écran',
		fullscreen_off			: 'Quitter le mode plein écran',
		datasource				: 'Contribuer',
		mark_seen				: 'Marquer comme étant terminé.',
		unmark_seen				: 'Retirer le marquage.',
		permalink				: 'Permalien',
		styleTitle: {
			seen: {
				show			: 'Les éléments marqués terminés sont affichés normalement.',
				fade			: 'Les éléments marqués terminés sont atténués par une légère transparence.',
				hide			: 'Les éléments marqués terminés sont cachés.',
				only			: 'Seuls les éléments marqués terminés sont affichés.'
			},
			unconfirmed: {
				show			: 'Les éléments non-vérifiés sont affichés normalement.',
				red				: 'Les éléments non-vérifiés sont colorés en rouge.',
				hide			: 'Les éléments non-vérifiés sont cachés.',
				only			: 'Seuls les éléments non-vérifiés sont affichés.'
			}
		}
	},
	properties: {
		type					: 'Catégorie',
		item					: 'Nom',
		item_id					: 'ID de l\u0027élément', // ID de l'élément
		amount					: 'Quantité',
		x						: 'X',
		y						: 'Y',
		z						: 'Z',
		area					: 'Zone',
		title					: 'Nom',
		description				: 'Description',
		source					: 'Source',
		confirmed				: 'Statut'
	},
	names: {
		area: {
			'.'					: 'Zones',
			1					: 'Maison', //Falaises instables
			2					: 'Bois du Coin',
			3					: 'Champs de Pollen',
			4					: 'Falaises Côtières',
			5					: 'Champs Clairsemés',
			6					: 'Montagnes Concaves',
			7					: 'Grande Vallée',
			8					: 'Crête Etroite',
			9					: 'Côtes Boréales',
			10					: 'Rivages Humides',
			11					: 'Sources Poussiéreuses',
			12					: 'Canyon Aride',
			13					: 'Dunes de Tunnel',
			14					: 'Baie Sèche',
			15					: 'Bords de Crête',
			16					: 'Bois Innondés',
			17					: 'Plateaux du Nord',
			18					: 'Passage de Telkin',
			19					: 'Mont Telkin',
			20					: 'Grande Crête',
			21					: 'Bois Eloignés'
		},
		entrance: {
			'.'					: 'Entrées', // ?
			cave				: 'Grottes',
			mohlenhill			: 'Coline de Mohlen',
			vault				: 'Voûtes'
		},
		food: {
			'.'					: 'Nourritures',
			alpafantmeat		: 'Viande de Alpafant',
			anurashroom			: 'Champi Anura',
			avianpepper			: 'Poivre d\u0027Avian', // Poivre d'Avian
			bleekerthigh		: 'Cuisse de Bleeker',
			carrant				: 'Carseille',
			commonwheat			: 'Blé Commun',
			dunerice			: 'Riz de Dune',
			edenfruit			: 'Fruit d\u0027Eden', // Fruit d'Eden
			fatplant			: 'Grotiron',
			leafdough			: 'Pâte Feuilletée',
			meageryam			: 'Patate Maigre',
			mudbeet				: 'Betterave de Boue',
			nuctus				: 'Nuctus',
			obergine			: 'Hobergine',
			puffleegg			: 'Oeufs de Puffle',
			ridgefennel			: 'Fenouil de Crête',
			roseberry			: 'Baie Rose',
			telkinchives		: 'Ciboulette de Telkin',
			tingflower			: 'Fleur d\u0027Acmella', //Fleur d'Acmella
			waddletoothloin		: 'Longe de Waddletooth'
		},
		idea: {
			'.'					: 'Idées',
			chest				: 'Coffres',
			pickup				: 'À ramasser',
			quest				: 'Quêtes'
		},
		item: {
			'.'					: 'Objets',
			equip				: 'Équipements',
			outfinding			: 'Horsvention',
			quest				: 'Quêtes'
		},
		material: {
			'.'					: 'Matériaux',
			alpafantleather		: 'Cuir de Alpafant',
			beagalite			: 'Beagalite',
			bleekerantenna		: 'Antenne de Bleeker',
			crassbone			: 'Os Commun',
			dryclay				: 'Argile Sèche',
			dullrock			: 'Pierre de Dull',
			grandcone			: 'Grand Cône',
			gravelmoss			: 'Mousse de Gravier',
			leaniron			: 'Fer Tendre',
			lunarodos			: 'Bois Nocturne',
			marrwood			: 'Bois de Marr',
			morrowhay			: 'Foin Doux',
			pufflefeather		: 'Plume de Puffle',
			sandstone			: 'Grès de Sable',
			slickpearl			: 'Perle Mirroir',
			softglass			: 'Verre Poli',
			solfodil			: 'Rayon de Glace',
			spystal				: 'Crachtal',
			stiffrope			: 'Stiffrope',
			stuffcloth			: 'Corde de Bois',
			toothstone			: 'Pierre de Dents',
			waddletoothblubber	: 'Gelée de Waddletooth'
		},
		mechanic: {
			'.'					: 'Mécanismes',
			door				: 'Portes',
			electrotrigger		: 'Déclencheurs électriques',
			hittrigger			: 'Déclencheurs normaux',
			lever				: 'Leviers',
			pinsocket			: 'Prises de broche' // ??? check in-game name
		},
		nest: {
			'.'					: 'Nid',
			alpafant			: 'Alpafant',
			bleeker				: 'Bleeker',
			puffle				: 'Puffle',
			waddletooth			: 'Waddletooth'
		},
		npc: {
			'.'					: 'PNJs', // or « Personnages non-joueurs »
			chief				: 'Chefs',
			merchant			: 'Marchants',
			quest				: 'Quêtes',
			village				: 'Villages'
		},
		spawn: {
			'.'					: 'Points d\u0027apparition', // Points d'apparition
			alpafant			: 'Alpafant',
			bleeker				: 'Bleeker',
			puffle				: 'Puffle',
			waddletooth			: 'Waddletooth'
		},
		unique: {
			'.'					: 'Objets unique',
			amphiscusorb		: 'Orbes',
			journal				: 'Journal / Livre',
			keygraphite			: 'Graphite de Clé'
		}
	}
}
