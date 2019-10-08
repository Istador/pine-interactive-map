const { storage } = require('./util')
const { versions } = require('./versions')
const { baseLayers } = require('./layers.js')

const defaultVersion = versions[0]
const defaultLayers = [
  'entrance.vault',
  'item.equip',
  'item.quest',
  'npc.quest',
  'unique.amphiscusorb',
  'unique.chest',
  'unique.emblem',
  'unique.idea',
]

const layers  = 'pine-selected-layers'
const version = 'pine-selected-version'

const get  = (key, def, inside = false) => () => {
  const stored = (storage().has(key) ? storage().get(key) : def)
  return (inside ? (stored in inside ? stored : def) : stored)
}
const save = (key) => (val) => storage().set(key, val)

module.exports = {
  version     : get(version, defaultVersion, baseLayers),
  layers      : get(layers, defaultLayers),
  saveVersion : save(version),
  saveLayers  : save(layers),
}
