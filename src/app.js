(() => {
  require('./js/coordinates')
  require('./js/style')
  const { bounds, maxBounds, baseLayers, water } = require('./js/layers')
  const { overlays, addMarker, initLayerControl } = require('./js/overlays')
  const { version } = require('./js/selection')
  const { datasource } = require('./js/datasource')
  const { registerRow, obj2marker } = require('./js/markers')
  const { translate, langComponent, langControl } = require('./js/i18n')

  // initialize the map
  const map = L.map('map', {
    crs                : L.CRS.Pine,
    center             : [ 0, 0 ],
    minZoom            : 0,
    maxZoom            : 5,
    zoom               : 0,
    zoomSnap           : 0.25,
    wheelPxPerZoomLevel: 120,
    maxBoundsViscosity : 1.0,
    zoomControl        : false,
    attributionControl : false,
    continuousWorld    : true,
    noWrap             : true,
    maxBounds,
    layers: [
      baseLayers[version()],
      ...overlays
    ],
  })
  const pane = map.createPane('water')
  pane.style.zIndex = -1
  pane.style.pointerEvents = 'none'
  water.addTo(map)

  // auto zoom
  map.fitBounds(bounds, { animate: false })
  langComponent(map, () => L.control.zoom({
    zoomInTitle  : translate('ui', 'zoom_in'),
    zoomOutTitle : translate('ui', 'zoom_out'),
  }))

  // attributions
  langComponent(map, () => L.control.attribution({ prefix: `<a href="https://github.com/Istador/pine-interactive-map" target="_blank">Github</a>` })
    .addAttribution('&copy; <a href="https://twirlbound.com/" target="_blank">Twirlbound</a>')
    .addAttribution(`<a href="${__SOURCE__}" target="_blank">${translate('ui', 'datasource')}</a>`)
  )

  // fullscreen button
  langComponent(map, () => new L.Control.Fullscreen({
    position: 'topleft',
    title: {
      'false' : translate('ui', 'fullscreen_on'),
      'true'  : translate('ui', 'fullscreen_off'),
    }
  }))

  // language selector
  langControl().addTo(map)

  // show mouse coordinates
  L.control.coordinates({ position: 'bottomleft' }).addTo(map)

  // control how to style completed / unconfirmed markers
  langComponent(map, () => L.control.style({ position: 'bottomleft' }))

  // get data from google docs spreadsheet
  datasource()
    .then(rows => {
      // register all markers before adding them to check the uniqueness of the IDs
      rows.forEach(registerRow)
      // add markers to map
      rows.forEach(row => addMarker(row.type, row.item, obj2marker(row)))
    })
    // control panel to allow the user to change the map and to select / deselect specific layers
    .then(() => initLayerControl(map))
    // invalidate size (no animation)
    .then(() => map.invalidateSize(false))
    // auto zoom
    .then(() => map.fitBounds(bounds, { animate: false }))
})()
