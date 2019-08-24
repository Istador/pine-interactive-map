const { storage } = require('./util')
const { translate } = require('./i18n')

const data = {
  seen: {
    states  : [ 'show', 'fade', 'hide', 'only' ],
    default : 'fade',
  },
  unconfirmed: {
    states  : [ 'show', 'red',  'hide', 'only' ],
    default : 'show',
  },
}

const mapDiv = L.DomUtil.get('map')

L.Control.Style = L.Control.extend({
  onAdd(map) {
    const div = L.DomUtil.create('div')
    div.classList.add('pine-style', 'leaflet-bar')
    Object.keys(data).forEach(key => {
      const obj = data[key]
      let state = storage().get('pine-style-' + key) || obj.default
      let index = obj.states.indexOf(state)
      if (index === -1) {
        state = obj.default
        index = obj.states.indexOf(state)
      }
      mapDiv.setAttribute('data-' + key, state)
      const subDiv = L.DomUtil.create('div', 'pine-style-' + key, div)
      const span   = L.DomUtil.create('span', '', subDiv)
      subDiv.setAttribute('title', translate('ui', 'styleTitle', key, state))
      subDiv.addEventListener('click', () => {
        index = (index + 1) % obj.states.length
        state = obj.states[index]
        storage().set('pine-style-' + key, state)
        mapDiv.setAttribute('data-' + key, state)
        subDiv.setAttribute('title', translate('ui', 'styleTitle', key, state))
      })
    })
    return div
  },
})

L.control.style = (opts) => new L.Control.Style(opts)
