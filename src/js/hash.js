const { id2marker } = require('./markers')
const { setLayers, addLayers, hasLayer } = require('./overlays')

const enabled = (() => {
  let state = true
  return {
    no  : () => state = false,
    yes : () => state = true,
    is  : () => state
  }
})()

const initHash = (map) => {
  let circle
  const hashChange = (() => {
    let hash
    const old = {}
    return () => {
      if (hash === window.location.hash) { return }

      // analyze hash
      hash = window.location.hash
      const hashes = hash
        .substr(1)
        .split('&')
        .map(str => str.split('='))
        .reduce((out, [k, v]) => ({ ...out, [k]: v }), {})

      // actions
      let zoom
      let coords
      let marker
      let layers
      let add_layers

      // id
      if (hashes.id && old.id !== hashes.id) {
        const id = Number(old.id = hashes.id)
        marker = id2marker(id)
        if (marker) {
          coords = marker.getLatLng()
          if (! hasLayer(map, marker.row.type, marker.row.item)) {
            add_layers = marker.row.type + '.' + marker.row.item
          }
        }
      }

      // x, z
      if (! coords && hashes.x && hashes.z && (old.x !== hashes.x || old.z !== hashes.z)) {
        const x = Math.max(-1024, Math.min(1024, Number(old.x = hashes.x)))
        const z = Math.max(-1024, Math.min(1024, Number(old.z = hashes.z)))
        if (hashes.x && hashes.z) {
          coords = [z - 1024, x + 1024]
        }
      }

      // zoom
      if (hashes.zoom && old.zoom !== hashes.zoom) {
        zoom = Math.max(0, Math.min(5, Math.round(Number(old.zoom = hashes.zoom))))
      }

      // layers
      if ('layers' in hashes && old.layers !== hashes.layers) {
        layers = old.layers = hashes.layers
      }

      // remove circle
      if (circle) { map.removeLayer(circle) }

      // hash changed by code? don't do the actions
      if (! enabled.is()) {
        enabled.yes()
        return
      }

      // do actions

      // select layers
      if (layers !== undefined) {
        setLayers(map, layers + ',' + add_layers)
      }
      else if (add_layers) {
        addLayers(map, add_layers)
      }

      // draw circle and panTo / zoom
      if (coords) {
        circle = L.circleMarker(coords, { radius: 15, color: 'orange' })
        circle.addTo(map)
        map.setView(coords, hashes.zoom ? zoom : undefined)
      }
      else if (hashes.zoom) {
        map.setZoom(zoom)
      }

      // open popup
      if (marker) {
        marker.openPopup()
      }
    }
  })()

  L.DomEvent.on(window, 'hashchange', hashChange)
  hashChange()
}

module.exports = {
  initHash,
}
