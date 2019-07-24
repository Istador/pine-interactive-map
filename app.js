(() => {
  // bounding box of the coordinate system used by the map
  const bounds = [
    [ -2048,   -0 ],
    [    +0, 2048 ],
  ]

  const layerOptions = {
    attribution: '&copy; <a href="https://twirlbound.com/" target="_blank">Twirlbound</a>',
  }

  const layers = {
    '3D': L.tileLayer('tiles/{z}/{x}/{y}.png', L.extend({}, layerOptions, {
      minNativeZoom : 0,
      maxNativeZoom : 4,
      tileSize      : 256,
      noWrap        : true,
      bounds        : bounds,
    })),
    '2D': L.imageOverlay('img/map/sharp.png', bounds, layerOptions),
  }

  const water = (() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
    svg.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink")
    svg.setAttribute('viewBox', "0 0 8192 8192")
    svg.innerHTML = (''
      + '<defs>'
      +   '<pattern patternUnits="userSpaceOnUse" id="water" x="0" y="0" width="256" height="256">'
      +     '<image width="256" height="256" xlink:href="img/map/water.png"/>'
      +   '</pattern>'
      + '</defs>'
      + '<rect width="8192" height="8192" fill="url(#water)" fill-opacity="0.5"/>'
    )
    return L.svgOverlay(
      svg,
      [
        [ -8192 -2048 , -8192       ],
        [ +8192       , +8192 +2048 ],
      ],
      layerOptions
    )
  })()

  // TODO: comment in irrelevant layers, once a hierarchical control panel is implemented
  const overlays = {
    quest: {
      npc   : L.layerGroup(),
      item  : L.layerGroup(),
      vault : L.layerGroup(),
    },
    resource: {
      anurashroom : L.layerGroup(),
      beagalite   : L.layerGroup(),
      dryclay     : L.layerGroup(),
      //dullrock    : L.layerGroup(),
      edenfruit   : L.layerGroup(),
      gravelmoss  : L.layerGroup(),
      leaniron    : L.layerGroup(),
      lunarodos   : L.layerGroup(),
      //marwood     : L.layerGroup(),
      morrowhay   : L.layerGroup(),
      //mudbeet     : L.layerGroup(),
      //obergine    : L.layerGroup(),
      sandstone   : L.layerGroup(),
      //toothstone  : L.layerGroup(),
    },
    unique: {
      cave        : L.layerGroup(),
      chest       : L.layerGroup(),
      emphiscis   : L.layerGroup(),
      idea        : L.layerGroup(),
      keygraphite : L.layerGroup(),
      mohlenhill  : L.layerGroup(),
    },
  }

  // Custom Coordinate System - see https://gis.stackexchange.com/questions/200865/leaflet-crs-simple-custom-scale
  L.CRS.Pine = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    // transf = tilesize ÷ mapsize = tilesize ÷ d(-1024,+1024) = 256 ÷ 2048 = 0.125
    transformation: new L.Transformation(0.125, 0, -0.125, 0),
    scale: (z) => Math.pow(2, z),
    zoom: (s) => Math.log(s) / Math.LN2,
    distance: (a, b) => {
      const dx = b.lng - a.lng
      const dy = b.lat - a.lat
      return Math.sqrt(dx * dx + dy * dy);
    },
    infinite: true,
  })

  // initialize the map
  const map = L.map('map', {
    crs                : L.CRS.Pine,
    center             : [ 0, 0 ],
    minZoom            : 0,
    maxZoom            : 5,
    zoom               : 0,
    maxBoundsViscosity : 1.0,
    attributionControl : false,
    continuousWorld    : true,
    noWrap             : true,

    // bigger maximum bounds for better UX
    maxBounds: [
      bounds[0].map(x => x - 512),
      bounds[1].map(x => x + 512),
    ],

    // default selected layers
    layers: [
      water,
      layers['3D'],
      overlays.quest.npc,
      overlays.quest.item,
      overlays.quest.vault,
      overlays.unique.emphiscis,
      overlays.unique.chest,
      overlays.unique.idea,
    ],
  })

  // auto zoom
  map.fitBounds(bounds)

  // Link to the spreadsheet
  L.control.attribution({ prefix: `<a href="${__SOURCE__}" target="_blank">Data source</a>` }).addTo(map)

  // allow the user to change the map and to select / deselect specific layers
  // TODO: save selection in localStorage
  // TODO: offer an hierarchical selection (unique, resource)
  // TODO: display icons in control panel
  L.control.layers(
    layers,
    {
      ...overlays.quest,
      ...overlays.unique,
      ...overlays.resource,
    },
    { collapsed: false }
  ).addTo(map)

  // icons
  const iconOpts = {
    default: {
      iconSize      : null,
      iconAnchor    : [  8,  8 ],
      popupAnchor   : [  0,  0 ],
      tooltipAnchor : [  0,  0 ],
    },
    quest: {
      default: {
        iconSize      : null,
        iconAnchor    : [  8,  8 ],
        popupAnchor   : [  0, -8 ],
        tooltipAnchor : [  0, -8 ],
      },
    },
    unique: {
      emphiscis: {
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
  }

  // utility functions
  const combine = (out, e) => ({...out, ...e})
  const partition = (arr, pred) => arr.reduce(
    ([t, f], e) => (
      pred(e)
      ? [[...t, e], f]
      : [t, [...f, e]]
    ),
    [[], []]
  )
  const merge = (target, source) => {
    for (let key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        source[key] = merge(target[key], source[key])
      }
    }
    return { ...target, ...source}
  }
  const classes = (key, row) => {
    return `pine-${key} pine-${key}-${row.type} pine-${key}-${row.type}-${row.item}`
  }

  axios
    // get spreadsheet as json
    .get(`${__JSON__}`)
    // extract cell contents
    .then(({data}) =>
      data.feed.entry
        .map(e => {
          const cell = e.title.$t
          const val = e.content.$t
          const num = Number(val.replace(',', '.'))
          return { [cell]: isNaN(num) ? val : num }
        })
        .reduce(combine, {})
      )
    // separate table header from content
    .then(cells =>
      partition(
        Object.keys(cells),
        cell => /^[A-Z]+1$/.test(cell)
      )
      .map(arr => arr.map(cell => ({ [cell]: cells[cell] })).reduce(combine, {}))
    )
    // combine cells in the same row together by using the table header as the properties name
    .then(([keys, vals]) =>
      Object.values(Object.keys(vals)
        .map(cell => {
            const val = vals[cell]
            const row = cell.replace(/[A-Z]/g, '')
            const col = cell.replace(/[0-9]/g, '')
            return { [ row ]: { [keys[ col + '1' ]]: val } }
        })
        .reduce(merge, {})
      )
    )
    // add markers to map
    .then(rows =>
      rows
        // only rows that have a designated layer
        .filter(row => row.type in overlays && row.item in overlays[row.type] && row.x !== undefined && row.y !== undefined)
        .forEach(row =>
          L.marker(
            [ row.x - 1024, row.y + 1024 ],
            {
              icon: L.divIcon(L.extend(
                {},
                ( row.type in iconOpts ? iconOpts[row.type][row.item] || iconOpts[row.type].default || iconOpts.default : iconOpts.default ),
                {
                  className: classes('marker', row)
                },
              ))
            }
          )
          // TODO: add 'mark completed' mechanic to hide already visited poi
          // TODO: HTML instead of JSON
          // TODO: images and/or videos
          .bindPopup(() => '<pre>' + JSON.stringify(row, null, 2) + '</pre>')
          .bindTooltip(
            () => (
              (row.amount && ! isNaN(Number(row.amount)) ? row.amount + 'x ' : '')
              + row.item
              + (row.description ? ': ' + row.description : '')
              + '<br/>(' + row.y + ', ' + row.x + ')'
              + (row.area ? ' in ' + row.area : '')
            ),
            { direction: 'top' })
          .addTo(overlays[row.type][row.item])
        )
    )
})()
