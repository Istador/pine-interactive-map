(function () {
  // bounding box of the coordinate system used by the map (is this correct? maybe 1024?)
  const bounds = [
    [ -1000, -1000 ],
    [  1000,  1000 ]
  ]

  const mapOptions = {
    attribution: '&copy; <a href="https://twirlbound.com/" target="_blank">Twirlbound</a>',
  }

  const maps = {
    '3D' : L.imageOverlay('img/map/render.png', bounds, mapOptions),
    '2D' : L.imageOverlay('img/map/sharp.png', bounds, mapOptions),
  }

  const overlays = {
    NPC: L.layerGroup([]),
    resource: {
      gravelmoss : L.layerGroup([]),
      obergine   : L.layerGroup([]),
    },
    unique: {
      emphiscis   : L.layerGroup([]),
      keygraphite : L.layerGroup([]),
      chest       : L.layerGroup([]),
    },
  }

  // initialize the map
  const map = L.map('map', {
    crs                : L.CRS.Simple,
    center             : [ 0, 0 ],
    minZoom            : -2,
    maxZoom            : 2,
    zoom               : -2,
    maxBounds          : bounds,
    maxBoundsViscosity : 1.0,
    attributionControl : false,
    layers: [
      maps['3D'],
      overlays.NPC,
      overlays.unique.emphiscis,
      overlays.unique.chest,
    ],
  })

  // Link to the spreadsheet
  L.control.attribution({ prefix: `<a href="${__SOURCE__}" target="_blank">Data source</a>` }).addTo(map)

  // allow the user to change the map and to select / deselect specific layers
  L.control.layers(
    maps,
    {
      NPC: overlays.NPC,
      ...overlays.unique,
      ...overlays.resource,
    },
    { collapsed: false }
  ).addTo(map)

  // icons
  const icons = {
    default: { icon: L.icon({
      iconUrl       : 'img/icons/default.png',
      iconSize      : [ 16, 16 ],
      iconAnchor    : [  8,  8 ],
      popupAnchor   : [  8, -8 ],
      tooltipAnchor : [  8, -8 ],
    }) },
    NPC: {
      default: { icon: L.icon({
        iconUrl       : 'img/icons/npc.png',
        iconSize      : [ 16, 16 ],
        iconAnchor    : [  8,  8 ],
        popupAnchor   : [  0, -8 ],
        tooltipAnchor : [  0, -8 ],
      }) },
    },
    unique: {
      emphiscis: { icon: L.icon({
        iconUrl       : 'img/icons/emphiscis.png',
        iconSize      : [ 16,  20 ],
        iconAnchor    : [  8,  10 ],
        popupAnchor   : [  0, -10 ],
        tooltipAnchor : [  0, -10 ],
      }) },
      keygraphite: { icon: L.icon({
        iconUrl       : 'img/icons/keygraphite.png',
        iconSize      : [ 16, 16 ],
        iconAnchor    : [  8,  8 ],
        popupAnchor   : [  0, -8 ],
        tooltipAnchor : [  0, -8 ],
      }) },
      chest: { icon: L.icon({
        iconUrl       : 'img/icons/chest.png',
        iconSize      : [ 16, 11.0 ],
        iconAnchor    : [  8,  5.5 ],
        popupAnchor   : [  0, -5.5 ],
        tooltipAnchor : [  0, -5.5 ],
      }) },
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
      if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
    }
    Object.assign(target || {}, source)
    return target
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
        .filter(row => row.type in overlays && (row.type === 'NPC' || row.item in overlays[row.type]))
        .forEach(row =>
          L.marker(
            [ row.x, row.y ],
            ( row.type in icons ? icons[row.type][row.item] || icons[row.type].default : icons.default )
          )
          .bindPopup(() => '<pre>' + JSON.stringify(row, Object.keys(row).sort(), 2) + '</pre>')
          .bindTooltip(
            () => row.item + '<br/>(' + row.y + ', ' + row.x + ')',
            { direction: 'top' })
          .addTo(row.type === 'NPC' ? overlays[row.type] : overlays[row.type][row.item])
        )
    )
})()
