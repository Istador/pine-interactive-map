const escapeHtml = (str) => str.replace(/[&<>'"]/g, x => '&#' + x.charCodeAt(0) + ';')

const { capitalize } = require('./names')
const { version } = require('./selection')

const text2number = (text) => {
  const num = Number(text.replace(',', '.'))
  return ( isNaN(num) ? text : num )
}

const transform = {
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
    wiki: async ({ data: { parse: { wikitext: { '*': text } } } }) => {
      const table = window.wtf(text).tables(0).data
      const out = []
      for (const i in table) {
        const row = table[i]
        const obj = {}
        for (const key in row) {
          const sentence = row[key]
          const text = sentence.data.text.trim()
          if (! text) { continue }
          obj[key] = text2number(text)
          if (sentence.data.links || sentence.data.fmt) {
            obj[key + '_html'] = sentence.html({formatting: true}).replace(' href="./', ` target="_blank" href="${__WIKI__}`)
          }
        }
        out.push(obj)
      }
      return out
    },
}

module.exports = {
  datasource: () => window.axios
    // get spreadsheet as json
    .get(`${__JSON__}`.replace('${VERSION}', version()))
    // convert cells into objects
    .then(transform[__DATAMODE__])
    // only rows that have coordinates
    .then(objs => objs.filter(row =>
         typeof row.x === 'number'
      && typeof row.z === 'number'
    )),
}
