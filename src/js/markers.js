const { storage } = require('./util')
const { icons } = require('./icons')
const { type2name, item2name } = require('./names')

const classes = (key, row) =>
  `pine-${key} pine-${key}-${row.type} pine-${key}-${row.type}-${row.item}`
  + (row.seen ? ' pine-poi-seen' : '')
  + (row.beta1 !== 'confirmed' ? ' pine-unconfirmed' : '')

const row2marker = (row) => L.marker(
  [ row.x - 1024, row.y + 1024 ],
  {
    icon: L.divIcon(L.extend(
      {},
      (
        row.type in icons
        ? icons[row.type][row.item] || icons[row.type].default || icons.default
        : icons.default
      ),
      {
        className: classes('marker', row)
      },
    ))
  }
)

const popup = (row, marker) => {
  const div   = L.DomUtil.create('div', classes('popup', row))
  //title
  const title = L.DomUtil.create('h4', '', div)
  title.innerHTML = type2name(row.type) + ' - ' + item2name(row.type)(row.item)
  // add all properties to table
  const tbody = L.DomUtil.create('tbody', '', L.DomUtil.create('table', '', div))
  // TODO: images and/or videos
  Object.keys(row).filter(x => x !== 'seen').forEach((k) => {
    const v = row[k]
    const tr = L.DomUtil.create('tr', '', tbody)
    if (row.ID) { tr.setAttribute('data-ID', row.ID) }
    const th = L.DomUtil.create('th', '', tr)
    th.innerHTML = k
    const td = L.DomUtil.create('td', '', tr)
    td.innerHTML = v
  })
  // TODO: disable mark completed feature for POI with IDs that aren't unique
  if (row.ID && storage().can() && [ 'unique', 'item', 'npc', 'entrance' ].includes(row.type)) {
    const toggle = L.DomUtil.create('button', '', div)
    toggle.setAttribute('type', 'button')
    toggle.setAttribute('title', (row.seen ? 'Mark not completed' : 'Mark completed'))
    toggle.innerHTML = '<span>' + (row.seen ? '&#x21ba;' : '&#x2713;') + '</span>'
    L.DomEvent.on(toggle, 'click', () => {
      row.seen = ! row.seen
      storage().set('pine-poi-seen-' + row.ID, row.seen)
      toggle.setAttribute('title', (row.seen ? 'Mark not completed' : 'Mark completed'))
      toggle.innerHTML = '<span>' + (row.seen ? '&#x21ba;' : '&#x2713;') + '</span>'
      div.classList[row.seen ? 'add' : 'remove']('pine-poi-seen')
      marker._icon.classList[row.seen ? 'add' : 'remove']('pine-poi-seen')
    })
  }
  return div
}

const tooltip = (row) =>
  (row.amount && ! isNaN(Number(row.amount)) ? row.amount + 'x ' : '')
    + item2name(row.type)(row.item)
    + (row.description ? ': ' + row.description : '')
    + '<br/>(' + row.y + ', ' + row.x + ')'
    + (row.area ? ' in ' + row.area : '')

const obj2marker = (row) => {
  // TODO: do not count the POI as seen, if it's ID is non-unique
  row.seen = (row.ID && storage().get('pine-poi-seen-' + row.ID))
  const marker = row2marker(row)
    .bindPopup(() => popup(row, marker))
    .bindTooltip(() => tooltip(row), { direction: 'top' })
  return marker
}

module.exports = {
  obj2marker,
}
