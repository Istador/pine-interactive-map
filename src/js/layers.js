// bounding box of the coordinate system used by the game
const gameBounds = [
  [ -1024, -1024 ],
  [ +1024, +1024 ],
]

// bounds that work together with the 3D tileLayer, everything else adjust itself to it
const bounds = gameBounds.map(([x, y]) => [ x - 1024, y + 1024 ])

// bigger maximum bounds for better UX
const maxBounds = [
  bounds[0].map(x => x - 512),
  bounds[1].map(x => x + 512),
]

// pine maps
const baseLayers = {
  '3D': L.tileLayer(`${__TILES__}`, {
    minNativeZoom : 0,
    maxNativeZoom : 4,
    tileSize      : 256,
    noWrap        : true,
    bounds        : bounds,
  }),
  '2D': L.imageOverlay(`${__2D_MAP__}`, bounds, {}),
}

// water background
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
svg.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink")
svg.setAttribute('viewBox', "0 0 8192 8192")
svg.innerHTML = (''
  + '<defs>'
  +   '<pattern patternUnits="userSpaceOnUse" id="water" x="0" y="0" width="256" height="256">'
  +     '<image width="256" height="256" xlink:href="img/map/water.png"/>'
  +   '</pattern>'
  + '</defs>'
  + '<rect width="8192" height="8192" fill="url(#water)" fill-opacity="0.5"/>'
)
const water = L.svgOverlay(
    svg,
    [
      bounds[0].map(x => x - 8192),
      bounds[1].map(x => x + 8192),
    ],
    {}
  )

// Custom Coordinate System - see https://gis.stackexchange.com/questions/200865/leaflet-crs-simple-custom-scale
L.CRS.Pine = L.extend({}, L.CRS.Simple, {
  projection: L.Projection.LonLat,
  // transf = tilesize ÷ mapsize = tilesize ÷ d(-1024,+1024) = 256 ÷ 2048 = 0.125
  transformation: new L.Transformation(0.125, 0, -0.125, 0),
  scale: (z) => Math.pow(2, z),
  zoom: (s) => Math.log(s) / Math.LN2,
  distance: (a, b) => {
    const dx = b.lng - a.lng
    const dy = b.lat - a.lat
    return Math.sqrt(dx * dx + dy * dy);
  },
  infinite: true,
})

module.exports = {
  bounds,
  maxBounds,
  baseLayers,
  water,
}
