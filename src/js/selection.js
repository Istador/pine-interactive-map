const { storage } = require('./util')

const defaultMap = '3D'
const defaultLayers = [
  'entrance.vault',
  'item.equip',
  'item.quest',
  'npc.quest',
  'unique.emblem',
  'unique.chest',
  'unique.idea',
]

const layers = 'pine-selected-layers'
const map    = 'pine-selected-map'

const get  = (key, def) => storage().has(key) ? storage().get(key) : def
const save = (key) => (val) => storage().set(key, val)

module.exports = {
  map        : get(map, defaultMap),
  layers     : get(layers, defaultLayers),
  saveMap    : save(map),
  saveLayers : save(layers),
}
