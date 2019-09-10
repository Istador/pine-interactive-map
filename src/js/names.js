const { translate } = require('./i18n.js')

const capitalize = (name) => name.split(/[ \._\-]/).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')

const retrieve = (type, item, key) => translate('names', type, item) || capitalize(key)

const type2name = (type) => retrieve(type, '.', type)

const item2name = (type) => (item) => retrieve(type, item, item)

module.exports = {
  type2name,
  item2name,
  capitalize,
}
