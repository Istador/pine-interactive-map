(() => {
  require('./js/coordinates')
  const { bounds, maxBounds, baseLayers, water } = require('./js/layers')
  const { overlays, addMarker, layerControl } = require('./js/overlays')
  const { map: selectedMap } = require('./js/selection')
  const { datasource } = require('./js/datasource')
  const { obj2marker } = require('./js/markers')

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
    maxBounds,
    layers: [
      water,
      baseLayers[selectedMap],
      ...overlays
    ],
  })

  // auto zoom
  map.fitBounds(bounds)

  // attributions
  L.control.attribution({ prefix: `<a href="https://github.com/Istador/pine-interactive-map" target="_blank">Github</a>` })
    .addAttribution('&copy; <a href="https://twirlbound.com/" target="_blank">Twirlbound</a>')
    .addAttribution(`<a href="${__SOURCE__}" target="_blank">Data source</a>`)
    .addTo(map)

  // fullscreen button
  map.addControl(new L.Control.Fullscreen({ position: 'topleft' }))

  // show mouse coordinates
  L.control.coordinates({ position: 'bottomleft' }).addTo(map)

  // get data from google docs spreadsheet
  datasource()
    // add markers to map
    .then(rows => rows.forEach(row => addMarker(row.type, row.item, obj2marker(row))))
    // control panel to allow the user to change the map and to select / deselect specific layers
    .then(() => layerControl.init().addTo(map))
})()
