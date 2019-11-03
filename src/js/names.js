const { translate } = require('./i18n')

const capitalize = (name) => name.split(/[ \._\-]/).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')

const retrieve = (type, item, key) => translate('names', type, item) || capitalize(key)

const type2name = (type) => retrieve(type, '.', type)

const item2name = (type) => (item) => retrieve(type, item, item)

const oldLayers = {
  'food.wheat'          : 'food.commonwheat',
  'item.equip'          : 'item.equipment',
  'unique.amphiscisorb' : 'unique.amphiscusorb',
  'unique.chest'        : 'idea.chest',
  'unique.emblem'       : 'unique.amphiscusorb',
  'unique.idea'         : 'idea.pickup',
}
const mapOldName = (layer) => oldLayers[layer] || layer
const mapOldBoth = (type, item) => mapOldName(type + '.' + item).split('.')

module.exports = {
  type2name,
  item2name,
  capitalize,
  mapOldName,
  mapOldBoth,
}
