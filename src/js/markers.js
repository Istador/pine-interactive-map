const { storage } = require('./util')
const { icons } = require('./icons')
const { type2name, item2name } = require('./names')
const { translate } = require('./i18n')
const { screenshot } = require('./screenshot')

const tints = {
  food: {
    map: {},
    n: 16,
    i: 0,
  },
  material: {
    map: {},
    n: 10,
    i: 6,
  },
  mechanic: {
    map: {},
    n: 5,
    i: 0,
  },
  nest: {
    map: {},
    n: 4,
    i: 6,
  },
  spawn: {
    map: {},
    n: 4,
    i: 6,
  },
}

const tint = (type, item) => (
  type in tints && ! (type in icons && item in icons[type])
  ? ' pine-marker-tint pine-marker-tint-' + (
    item in tints[type].map
    ? tints[type].map[item]
    : tints[type].map[item] = ((tints[type].i++) % tints[type].n)
  )
  : ''
)

const row2icon = (row) => (
  row.type in icons
  ? icons[row.type][row.item] || icons[row.type].default || icons.default
  : icons.default
)

const classes = (key, row) => (
  `pine-${key} pine-${key}-${row.type} pine-${key}-${row.type}-${row.item}`
  + tint(row.type, row.item)
  + (row.seen ? ' pine-poi-seen' : '')
  + (row.confirmed !== 'confirmed' ? ' pine-unconfirmed' : '')
)

const row2marker = (row) => L.marker(
  [ row.z - 1024, row.x + 1024 ],
  {
    icon: L.divIcon(L.extend(
      {},
      row2icon(row),
      {
        className: classes('marker', row)
      },
    ))
  }
)
const dont_show = [ 'seen', 'hasUniqueID', 'screenshot', 'screenshot_page', 'title_link', 'item_link', 'type_link' ]
const showProp = (prop) => ! dont_show.includes(prop) && ! /_html$/.test(prop)

const showCompleteButton = (row) => (
     storage().can()
  && row.hasUniqueID
  && [ 'unique', 'idea', 'item', 'npc', 'entrance' ].includes(row.type)
)

const updateToggle = (toggle, row) => {
  toggle.setAttribute('title', translate('ui', row.seen ? 'unmark_seen' : 'mark_seen'))
  toggle.innerHTML = '<span>' + (row.seen ? '&#x21ba;' : '&#x2713;') + '</span>'
}

const popup = (row, marker) => {
  const div = L.DomUtil.create('div', classes('popup', row))
  //title
  const title = L.DomUtil.create('h4', '', div)
  title.innerHTML = type2name(row.type) + ' - ' + item2name(row.type)(row.item)
  // Screenshots
  if (row.screenshot) {
    screenshot(row.screenshot.replace(' ', '_'), div, row.screenshot_page || row.title_link || row.item_link || row.type_link)
  }
  // add all properties to the table
  const tbody = L.DomUtil.create('tbody', '', L.DomUtil.create('table', '', div))
  Object.keys(row).filter(showProp).forEach((k) => {
    const tr = L.DomUtil.create('tr', '', tbody)
    if (row.ID) { tr.setAttribute('data-ID', row.ID) }
    const th = L.DomUtil.create('th', '', tr)
    th.innerHTML = translate('properties', k) || k
    const td = L.DomUtil.create('td', '', tr)
    td.innerHTML = row[k + '_html'] || row[k]
  })
  // button to mark poi as completed / not-completed
  if (showCompleteButton(row)) {
    const toggle = L.DomUtil.create('button', '', div)
    toggle.setAttribute('type', 'button')
    updateToggle(toggle, row)
    L.DomEvent.on(toggle, 'click', () => {
      row.seen = ! row.seen
      storage().set('pine-poi-seen-' + row.ID, row.seen)
      updateToggle(toggle, row)
      div.classList[row.seen ? 'add' : 'remove']('pine-poi-seen')
      marker._icon.classList[row.seen ? 'add' : 'remove']('pine-poi-seen')
    })
  }
  // permalink
  if (row.hasUniqueID) {
    const link = L.DomUtil.create('a', '', div)
    link.setAttribute('href', '#id=' + row.ID)
    link.setAttribute('title', translate('ui', 'permalink'))
    const button = L.DomUtil.create('button', '', link)
    button.setAttribute('type', 'button')
    button.innerHTML = '<span>🔗</span>'
  }
  return div
}

const tooltip = (row) =>
  (row.amount && ! isNaN(Number(row.amount)) ? row.amount + 'x ' : '')
    + (
      row.item === 'quest' && [ 'idea', 'item' ].includes(row.type)
      ? item2name(row.type)(row.item) + ' ' + type2name(row.type)
      : (
        row.type === 'idea' || row.type === 'npc' && row.item === 'quest'
        ? type2name(row.type)
        : item2name(row.type)(row.item)
      )
    )
    + (row.title ? ': ' + row.title : '')
    + '<br/>(' + row.x + ', ' + row.z + ')'
    + (row.area ? ' in ' + row.area : '')

// detect uniqueness of IDs
let uniqueIDs = {}
const registerRow = (row) => {
  if (! row.ID) { return }
  uniqueIDs[row.ID] = ! (row.ID in uniqueIDs)
}

// markers by id
let markersByID = {}
const id2marker = (id) => markersByID[id]

const obj2marker = (row) => {
  row.hasUniqueID = (row.ID && uniqueIDs[row.ID])
  row.seen = (row.hasUniqueID && storage().get('pine-poi-seen-' + row.ID))
  const icon = row2icon(row)
  const marker = row2marker(row)
    .bindPopup(() => popup(row, marker))
    .bindTooltip(
      () => tooltip(row),
      {
        direction: 'top',
      }
    )
  if (row.hasUniqueID) {
    markersByID[row.ID] = marker
  }
  marker.row = row
  return marker
}

const resetMarkers = () => {
  markersByID = {}
  uniqueIDs = {}
}

module.exports = {
  registerRow,
  obj2marker,
  id2marker,
  tint,
  resetMarkers,
}
