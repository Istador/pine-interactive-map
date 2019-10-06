const { versions } = require('./versions')

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

const baseLayers = {}
versions.forEach(v => {
  baseLayers[v] = L.tileLayer(`${__TILES__}`, {
    minNativeZoom : 0,
    maxNativeZoom : 4,
    tileSize      : 256,
    noWrap        : true,
    bounds        : bounds,
    version       : v,
  })
})

// water background
const svg = (new DOMParser())
  .parseFromString(
    `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8192 8192">
      <defs>
       <pattern patternUnits="userSpaceOnUse" id="water" x="0" y="0" width="256" height="256">
         <image width="256" height="256" xlink:href="img/map/water.png"/>
       </pattern>
      </defs>
      <rect width="8192" height="8192" fill="url(#water)" fill-opacity="0.5"/>
    </svg>
    `,
    'text/xml'
  )
  .documentElement

const water = L.svgOverlay(
    svg,
    [
      bounds[0].map(x => x - 8192),
      bounds[1].map(x => x + 8192),
    ],
    {
      pane: 'water',
    }
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
