const { storage } = require('./util')
const { versions } = require('./versions')
const { baseLayers } = require('./layers')
const { mapOldName } = require('./names')

const defaultVersion = versions[0]
const defaultLayers = [
  'entrance.cave',
  'entrance.vault',
  'idea.chest',
  'idea.pickup',
  'idea.quest',
  'item.equip',
  'item.quest',
  'npc.village',
  'unique.amphiscusorb',
]

const layers  = 'pine-selected-layers'
const version = 'pine-selected-version'

const get  = (key, def, inside = false) => () => {
  const stored = (storage().has(key) ? storage().get(key) : def)
  return (inside ? (stored in inside ? stored : def) : stored)
}
const save = (key) => (val) => storage().set(key, val)

const mapAll = (f) => () => f().map(mapOldName)

module.exports = {
  version     : get(version, defaultVersion, baseLayers),
  layers      : mapAll(get(layers, defaultLayers)),
  saveVersion : save(version),
  saveLayers  : save(layers),
}
