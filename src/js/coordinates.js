L.Control.Coordinates = L.Control.extend({
  onAdd(map) {
    const div = L.DomUtil.create('div')
    div.classList.add('pine-mouse-coordinates', 'leaflet-bar')
    div.innerHTML = '(0.0, 0.0)'
    this.mousehandler = (ev) => div.innerHTML = '(' + Math.round(ev.latlng.lng - 1024) + ', ' + Math.round(ev.latlng.lat + 1024) + ')'
    map.addEventListener('mousemove', this.mousehandler)
    return div
  },
  onRemove(map) {
    map.removeEventListener('mousemove', this.mousehandler)
  },
})

L.control.coordinates = (opts) => new L.Control.Coordinates(opts)
