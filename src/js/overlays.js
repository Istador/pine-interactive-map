const { lazy } = require('./util')
const { baseLayers } = require('./layers')
const { type2name, item2name } = require('./names')
const { layers, saveLayers, saveMap } = require('./selection')
const { translate, langComponent } = require('./i18n')

const overlays = {}
const defaultOverlays = layers.map(x => x.split('.'))

const addOverlay = (type, item) => {
  if (!(type in overlays)) {
    overlays[type] = {}
  }
  if (!(item in overlays[type])) {
    overlays[type][item] = L.layerGroup()
  }
}

const addMarker = (type, item, marker) => {
  addOverlay(type, item)
  marker.addTo(overlays[type][item])
}

// TODO: ability to hide all completed poi
// TODO: ability to show only completed poi

// map key to name, sort by name
const mapsort = (obj, map, then) =>
  Object.keys(obj)
    .sort((a, b) => map(a).localeCompare(map(b)))
    .forEach(k => then(k, map(k), obj[k]))

const initLayerControl = (map) => {
  langComponent(map, () => {
    const layerControl = new L.Control.PanelLayers(
      [
        { name: translate('ui', '3D'), layer: baseLayers['3D'] },
        { name: translate('ui', '2D'), layer: baseLayers['2D'] },
      ],
      {},
      {
        title: translate('ui', 'title'),
        collapsibleGroups: true,
        compact: true,
      }
    )

    // sort the overlays by name
    mapsort(overlays, type2name, (type, typeName, items) =>
        mapsort(items, item2name(type), (item, itemName, layer) =>
          layerControl._addLayer(
            {
              layer : layer,
              name  : itemName + ' (' + layer.getLayers().length + ')',
              icon  : `<i class="pine-marker pine-marker-${type} pine-marker-${type}-${item}"> </i>`,
            },
            true, // isOverlay and not baseLayer
            typeName, // group name
            ! defaultOverlays.some(def => def[0] === type) // collapse groups that have no layers selected
          )
        )
    )

    // listen to changes to the selected layers => save
    L.DomEvent.on(layerControl, 'panel:selected panel:unselected', () => {
      const selectedLayers = []
      for (type in overlays) {
        for (item in overlays[type]) {
          if (layerControl._map.hasLayer(overlays[type][item])) {
            selectedLayers.push(type + '.' + item)
          }
        }
      }
      saveLayers(selectedLayers)
      saveMap(layerControl._map.hasLayer(baseLayers['3D']) ? '3D' : '2D')
    })

    return layerControl
  })
}

// add all selected layers to overlays, so that they can be added to the map before they are created dynamically
defaultOverlays.forEach(([type, item]) => addOverlay(type, item))

// flattened Array of all selected layers
const overlaysArray = Object.values(overlays).map(x => Object.values(x)).reduce((a, x) => [...a, ...x], [])

module.exports = {
  overlays: overlaysArray,
  addMarker,
  initLayerControl,
}
