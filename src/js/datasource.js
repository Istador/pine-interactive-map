const escapeHtml = (str) => str.replace(/[&<>'"]/g, x => '&#' + x.charCodeAt(0) + ';')

const { capitalize, mapOldBoth } = require('./names')
const { version } = require('./selection')
const { lazy } = require('./util')

const text2number = (text) => {
  const num = Number(text.replace(',', '.'))
  return ( isNaN(num) ? text : num )
}

const wikiUrl = lazy(() => new URL(__JSON__))

const fetch = {
  spreadsheet: () => window.axios.get(`${__JSON__}`.replace('${VERSION}', version())),
  wiki: () => window.wtf.fetch(
    'Interactive Map/' + version().replace('.', '_'),
    {
      domain : wikiUrl().hostname,
      path   : wikiUrl().pathname.substr(1),
      follow_redirects : true,
    },
  ),
}

const transform = {
  // Google Sheets v3 API has been turned down, so this doesn't work anymore
  spreadsheet: ({ data: { feed: { entry: entries } } }) => {
    const keys = {}
    const objs = {}
    let moreKeys = true
    const isKey = (cell) => moreKeys && /^[A-Z]+1$/.test(cell)
    const n = entries.length
    for (let i = 0 ; i < n; i++) {
      if (!(i in entries)) { continue }
      const e = entries[i]
      const cell = e.title.$t
      const cont = escapeHtml(e.content.$t)
      if (isKey(cell)) {
        keys[cell] = cont
      }
      else {
        moreKeys = false
        const val = text2number(cont)
        objs[cell] = val
        const row = cell.replace(/[A-Z]/g, '')
        const col = cell.replace(/[0-9]/g, '')
        if (! (row in objs)) { objs[row] = {} }
        objs[row][keys[ col + '1' ]] = val
      }
    }
    return Object.values(objs)
  },
  wiki: async (document) => {
    const table = document.tables()[0].data
    const out = []
    for (const i in table) {
      const row = table[i]
      const obj = {}
      for (const key in row) {
        const sentence = row[key]
        const text = sentence.data.text.trim()
        if (! text) { continue }
        const val = text2number(text)

        obj[key] = (
          key === 'type' || key === 'item'
          ? val.replace(/[\_\- ]/g, '').toLowerCase()
          : val
        )
        if (sentence.data.links.length || sentence.data.fmt) {
          obj[key + '_html'] = sentence.html({formatting: true}).replace(/ href="\.\//g, ` target="_blank" href="${__WIKI__}`)
        }
        else if (key === 'type' || key === 'item') {
          obj[key + '_html'] = val
        }

        if ([ 'title', 'item', 'type' ].includes(key) && row.screenshot && sentence.data.links.length) {
          obj[key + '_link'] = sentence.data.links[0].data.page
        }

        if (key === 'screenshot' && val) {
          obj[key] = sentence.data.wiki.replace(/^\[\[:File:/, '').replace(/\]\]$/, '')
        }

        // round coords
        if ([ 'x', 'y', 'z' ].includes(key)) {
          obj[key] = Math.round(obj[key] * 100) / 100
        }
      }
      const [ type, item ] = mapOldBoth(obj.type, obj.item)
      obj.type = type
      obj.item = item
      out.push(obj)
    }
    return out
  },
}

module.exports = {
  datasource: () =>
    // get spreadsheet as json
    fetch[__DATAMODE__]()
    // convert cells into objects
    .then(transform[__DATAMODE__])
    // only rows that have coordinates
    .then(objs => objs.filter(row =>
         typeof row.x === 'number'
      && typeof row.z === 'number'
    )),
}
