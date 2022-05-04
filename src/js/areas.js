const { areas } = require('./areas_data')
const { storage } = require('./util')
const { bounds } = require('./layers')
const { addMarker, removeMarker } = require('./overlays')
const { translate } = require('./i18n')
const { screenshot } = require('./screenshot')

// svg dimensions
const viewBox = '0 0 135.47 135.47'
const offset  = '-38.72444,-53.135815'
const scale = 2048 / 135.47

const classes = (key, area, alwaysUnseen = false) => (
  `pine-${key} pine-${key}-area`
  + (! alwaysUnseen && seen(area) ? ' pine-poi-seen' : '')
)

const seen = (area) => {
  if (! ('seen' in area)) {
    area.seen = storage().get('pine-poi-seen-area-' + area.id) || false
  }
  return area.seen
}

const updateToggle = (toggle, area) => {
  toggle.setAttribute('title', translate('ui', area.seen ? 'unmark_seen' : 'mark_seen'))
  toggle.innerHTML = '<span>' + (area.seen ? '&#x21ba;' : '&#x2713;') + '</span>'
}

const tooltip = (area) => () => translate('names', 'area', area.id)
const tooltipOpts = {
  sticky: true,
  direction: 'top',
}

const popup = (area) => () => {
  const marker = area.layer
  const div = L.DomUtil.create('div', classes('popup', area))

  const type = translate('names', 'area', '.')
  const name = translate('names', 'area', area.id)
  const wiki = area.name.replace(' ', '_')

  //title
  const title = L.DomUtil.create('h4', '', div)
  title.innerHTML = type + ' - ' + name

  // Screenshots
  screenshot('Glossary-Area-' + wiki + '.png', div, wiki)

  // add all properties to the table
  const row = {
    type  : type,
    title : `<a href="${__WIKI__}${wiki}" target="_blank">${name}</a>`,
  }
  const tbody = L.DomUtil.create('tbody', '', L.DomUtil.create('table', '', div))
  Object.keys(row).forEach((k) => {
    const tr = L.DomUtil.create('tr', '', tbody)
    const th = L.DomUtil.create('th', '', tr)
    th.innerHTML = translate('properties', k) || k
    const td = L.DomUtil.create('td', '', tr)
    td.innerHTML = row[k]
  })

  // button to mark area as completed / not-completed
  if (storage().can()) {
    const toggle = L.DomUtil.create('button', '', div)
    toggle.setAttribute('type', 'button')
    updateToggle(toggle, area)
    L.DomEvent.on(toggle, 'click', () => {
      area.seen = ! area.seen
      storage().set('pine-poi-seen-area-' + area.id, area.seen)
      updateToggle(toggle, area)
      div.classList[area.seen ? 'add' : 'remove']('pine-poi-seen')
      marker.getElement().classList[area.seen ? 'add' : 'remove']('pine-poi-seen')
    })
  }

  // permalink
  const link = L.DomUtil.create('a', '', div)
  link.setAttribute('href', '#area=' + area.id)
  link.setAttribute('title', translate('ui', 'permalink'))
  const button = L.DomUtil.create('button', '', link)
  button.setAttribute('type', 'button')
  button.innerHTML = '<span>🔗</span>'

  return div
}

// svg coordinates => game coordinates
const svg2pos = (obj) => ({
  x : -1024 + scale * (obj.x - 38.72444),
  y :  1024 - scale * (obj.y - 53.135815),
})

// game coordinates => LonLat coordinates for the map
const pos2lat = (pos) => [ pos.y - 1024, pos.x + 1024 ]

// transform the bounding box into game coordinates
const bb2pos = (r) => {
  const rect = svg2pos(r)
  rect.width  = r.width  * scale
  rect.height = r.height * scale
  return rect
}

// bounding box from svg
const bbox = (area, svg) => {
  if (area.bbox) { return area.bbox }
  return area.bbox = bb2pos(svg.getElementsByTagName('path')[0].getBBox())
}

// a 50% bigger bounding box for fitting it on the screen
const bboxzoom = (area, svg) => {
  const bb = bbox(area, svg)
  return [
    pos2lat({
      x: bb.x - bb.width  * 0.5,
      y: bb.y + bb.height * 0.5,
    }),
    pos2lat({
      x: bb.x + bb.width  * 1.5,
      y: bb.y - bb.height * 1.5,
    }),
  ]
}

// center of the bounding box
const bbcenter = (area, svg) => {
  if (area.center) { return area.center }
  const bb = bbox(area, svg)
  return area.center = {
    x : bb.x + bb.width  * 0.5,
    y : bb.y - bb.height * 0.5,
  }
}

// polygon mass center
const centroid = (area) => {
  if (area.centroid) { return area.centroid }

  const px = points(area)
  const out = { x: 0, y: 0 }
  let ax = 0
  for (let i = 0; i < px.length; i++) {
    const j = (i + 1) % px.length
    const { x: xi, y: yi } = px[i]
    const { x: xj, y: yj } = px[j]
    const a = (xi * yj - xj * yi)
    ax    += a
    out.x += (xi + xj) * a
    out.y += (yi + yj) * a
  }
  ax *= 0.5
  out.x *= 1 / (6 * ax)
  out.y *= 1 / (6 * ax)

  area.area = ax
  return area.centroid = out
}

// average x and y of all points
const average = (area) => {
  if (area.average) { return area.average }

  const px = points(area)
  const out = { x: 0, y: 0 }
  for (const p of px) {
    out.x += p.x
    out.y += p.y
  }
  out.x /= px.length
  out.y /= px.length

  return area.average = out
}

// svg path => all points in game coordinates of the biggest polygon
const points = (area) => {
  if (area.points) { return area.points }

  const arr = area.path.split(' ')
  const areas = []
  let i = -1 // areas[i]
  let j = 0  // arr[j]
  let k = 0  // k % 3 (because of bezier curves)
  let xd = 0
  let yd = 0
  for (j = 0 ; j < arr.length ; j++) {
    const val = arr[j]
    // new separata polygon
    if (val === 'm') {
      i++
      j++
      areas[i] = []
    }
    // skip syntax
    else if (val === 'c' || val === 'z') { continue }
    // bezier points
    else if (k % 3 !== 2) {
      k++
      continue
    }
    // real point
    else {
      k++
    }
    // add point
    const [x0, y0] = arr[j].split(',').map(x => Number(x))
    if (isNaN(x0) || isNaN(y0)) { break }
    xd += x0
    yd += y0
    areas[i].push({ x: xd, y: yd })
  }
  areas.sort((a, b) => b.length - a.length)
  return area.points = areas[0].map(svg2pos)
}

area2overlay = (area, fill, stroke, strokeWidth) => {
  const real = ! fill && ! stroke && ! strokeWidth

  // use cache
  if (real && area.layer && area.svg) {
    return area
  }
  const svg = (new DOMParser())
    .parseFromString(
      `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}">
        <g id="g9" transform="translate(${offset})">
          <path
            id="${area.id}"
            d="${area.path}"
            style="fill:${fill || area.color};fill-opacity:0.6;stroke:${stroke || area.color};stroke-width:${strokeWidth || 0.3};stroke-linecap:round;stroke-linejoin:round"
          >
          </path>
        </g>
      </svg>
      `,
      'text/xml'
    )
    .documentElement
  const layer = L.svgOverlay(
    svg,
    [
      [ -2048, 0 ],
      [ 0, +2048 ],
    ],
    {
      interactive : true,
      pane        : 'areas',
      className   : classes('marker', area, ! real),
    }
  )
  // set cache
  if (real) {
    area.layer = layer
    area.svg   = svg
  }

  layer.bindTooltip(tooltip(area), tooltipOpts)
  layer.bindPopup(real ? popup(area) : area.layer._popup)

  return { layer, svg }
}

const addAreas = (() => {
  let pane
  return (map) => {
    // only once
    if (! pane) {
      pane = map.createPane('areas')
      pane.style.zIndex = 500
      pane.style.pointerEvents = 'none'
    }
    areas.forEach(area => {
      if (! area.group) {
        const { layer } = area2overlay(area)
        area.group = L.layerGroup()
        layer.addTo(area.group)
      }
      addMarker('area', area.id, area.group)
    })
  }
})()

// #area=${id}
const highlightArea = (id, map) => {
  const area = areas[id - 1]
  if (! area) { return }
  const group = L.layerGroup()
  const { layer, svg } = area2overlay(area, '#ffffff', '#000000', '0.5')
  layer.addTo(group)
  group.addTo(area.group)

  const round = (pos) => Math.round(pos.x * 100) / 100 + ', ' + Math.round(pos.y * 100) / 100

  map.fitBounds(bboxzoom(area, svg), { animate: false, maxZoom: 2.5 })
  area.layer.openPopup(pos2lat(centroid(area)))

  // debug: show polygon points and possible center coordinates
  /*
  const c = L.marker(pos2lat(bbcenter(area, svg)), { icon: L.divIcon({className: 'pine-marker pine-marker-area pine-marker-area-1', iconSize: null}) })
  c.bindTooltip('bbcenter')
  c.addTo(group)

  const c2 = L.marker(pos2lat(centroid(area)), { icon: L.divIcon({className: 'pine-marker pine-marker-area pine-marker-area-2', iconSize: null}) })
  c2.bindTooltip('centroid')
  c2.addTo(group)

  const c3 = L.marker(pos2lat(average(area)), { icon: L.divIcon({className: 'pine-marker pine-marker-area pine-marker-area-3', iconSize: null}) })
  c3.bindTooltip('average')
  c3.addTo(group)

  points(area).forEach(p => {
    const m = L.marker(pos2lat(p), { icon: L.divIcon({className: 'pine-marker pine-marker-area pine-marker-area-4', iconSize: null}) })
    m.bindTooltip(round(p))
    m.addTo(group)
  })
  */

  return () => area.group.removeLayer(group)
}

module.exports = {
  addAreas,
  highlightArea,
}
