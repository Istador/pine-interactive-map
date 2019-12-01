const { lazy } = require('./util')
const { baseLayers } = require('./layers')
const { tint } = require('./markers')
const { type2name, item2name, mapOldName } = require('./names')
const { layers, saveLayers, version, saveVersion } = require('./selection')
const { translate, langComponent } = require('./i18n')
const { versions, changeVersion } = require('./versions')
const { rememberCollapsed, isCollapsed, resetCollapsed, addCollapsed } = require('./collapsed')

const overlays = {}
let currentLayers = layers().map(x => x.split('.'))
const onlyExistingLayers = ([type, item]) => type in overlays && item in overlays[type]

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

const removeMarker = (type, item, marker) => {
  overlays[type][item].removeLayer(marker)
}

const collapseGroup = (type) => {
  // collapse how it was before
  const collapsed = isCollapsed(type)
  if (collapsed !== null) { return collapsed }
  // first run, collapse groups that have no layers selected or all of them selected
  const all      = Object.keys(overlays[type]).length
  const selected = currentLayers.filter(onlyExistingLayers).filter(def => def[0] === type).length
  return selected === 0 || selected >= all
}

// map key to name, sort by name
const mapsort = (obj, map, then) =>
  Object.keys(obj)
    .sort((a, b) => map(a).localeCompare(map(b)))
    .forEach(k => then(k, map(k), obj[k]))

let layerControlReset
const initLayerControl = (map) => {
  layerControlReset = langComponent(map, () => {
    const layerControl = new L.Control.PanelLayers(
      versions.map(v => ({
        name  : v.replace('_', ' '),
        layer : baseLayers[v],
      })),
      {},
      {
        title: translate('ui', 'title'),
        collapsibleGroups: true,
        groupCheckboxes: true,
        compact: true,
      }
    )

    // remove empty layer groups
    for (const type in overlays) {
      for (const item in overlays[type]) {
        if (overlays[type][item] && overlays[type][item].getLayers().length === 0) {
          map.removeLayer(overlays[type][item])
          delete overlays[type][item]
        }
      }
    }

    resetCollapsed()

    // sort the overlays by name
    mapsort(overlays, type2name, (type, typeName, items) => {
      addCollapsed(type, typeName)
      const collapsed = collapseGroup(type)
      mapsort(items, item2name(type), (item, itemName, layer) =>
        layerControl._addLayer(
          {
            layer : layer,
            name  : itemName + ( type === 'area' ? '' : ' (' + layer.getLayers().length + ')' ),
            icon  : `<i class="pine-marker pine-marker-${type} pine-marker-${type}-${item}${tint(type, item)}"> </i>`,
          },
          true, // isOverlay and not baseLayer
          typeName, // group name
          collapsed // group collapsed
        )
      )
    })

    // listen to changes to the selected layers => save
    L.DomEvent.on(layerControl, 'panel:selected panel:unselected', () => {
      // selected layers
      const selectedLayers = []
      for (const type in overlays) {
        for (const item in overlays[type]) {
          if (overlays[type][item] && layerControl._map.hasLayer(overlays[type][item])) {
            selectedLayers.push(type + '.' + item)
          }
        }
      }
      saveLayers(selectedLayers)
      currentLayers = layers().map(x => x.split('.'))

      // selected game version
      const selectedVersion = versions.reduce((out, v) => layerControl._map.hasLayer(baseLayers[v]) ? v : out)
      if (version() !== selectedVersion) {
        saveVersion(selectedVersion)
        changeVersion(map)
      }
    })

    return layerControl
  })
}

// add all selected layers to overlays, so that they can be added to the map before they are created dynamically
currentLayers.forEach(([type, item]) => addOverlay(type, item))

// flattened Array of all selected layers
const overlaysArray = Object.values(overlays).map(x => Object.values(x)).reduce((a, x) => [...a, ...x], [])

// remove all existing layers from the map
const removeLayers = (map) => {
  for (const type in overlays) {
    for (const item in overlays[type]) {
      if (overlays[type][item]) {
        map.removeLayer(overlays[type][item])
      }
    }
  }
}

// reset the component by removing everything
const resetLayers = (map) => {
  // remember collapsed groups
  rememberCollapsed()
  // remove from map
  removeLayers(map)
  // remove from cached data structure
  Object.keys(overlays).forEach(key => {
    delete overlays[key]
  })
  // reinit the component to show it being empty
  layerControlReset()
}

const reinitLayers = (map) => {
  // readd the selected layers to the map
  currentLayers
    .filter(onlyExistingLayers)
    .forEach(([type, item]) => {
      map.addLayer(overlays[type][item])
    })
  // reinit the component
  layerControlReset()
}

const hasLayer = (map, type, item) =>
     type in overlays
  && item in overlays[type]
  && overlays[type][item]
  && map.hasLayer(overlays[type][item])

const addLayers = (map, layers) => {
  try {
    for (const layer of layers.split(',')) {
      try {
        const [type, item] = mapOldName(layer).split('.')
        // add the specific layer
        if (type && item && type in overlays && item in overlays[type] && overlays[type][item]) {
          map.addLayer(overlays[type][item])
          currentLayers.push([type, item])
        }
        // add all layers of this type
        else if (type && ! item && type in overlays) {
          for (const item in overlays[type]) {
            if (overlays[type][item]) {
              map.addLayer(overlays[type][item])
              currentLayers.push([type, item])
            }
          }
        }
      }
      catch {}
    }
  }
  catch {}
  // reinit the component
  layerControlReset()
}

const setLayers = (map, layers) => {
  // remove layers from map
  removeLayers(map)
  currentLayers = []
  // add layers to map
  addLayers(map, layers)
}

module.exports = {
  overlays: overlaysArray,
  addMarker,
  removeMarker,
  initLayerControl,
  resetLayers,
  reinitLayers,
  hasLayer,
  addLayers,
  setLayers,
}
