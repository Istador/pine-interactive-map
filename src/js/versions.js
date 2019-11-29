const versions = JSON.parse(__VERSIONS__)

const changeVersion = (map) => {
  const { addMarker, resetLayers, reinitLayers } = require('./overlays')
  const { datasource } = require('./datasource')
  const { registerRow, obj2marker, resetMarkers } = require('./markers')
  const { addAreas } = require('./areas')

  resetMarkers()
  resetLayers(map)
  addAreas(map)
  datasource()
    .then(rows => {
      rows.forEach(registerRow)
      rows.forEach(row => addMarker(row.type, row.item, obj2marker(row)))
    })
    .then(() => reinitLayers(map))
}

module.exports = {
  versions,
  changeVersion,
}
