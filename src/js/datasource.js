const escapeHtml = (str) => str.replace(/[&<>'"]/g, x => '&#' + x.charCodeAt(0) + ';')

module.exports = {
  datasource: () => axios
    // get spreadsheet as json
    .get(`${__JSON__}`)
    // convert cells into objects
    .then(({data: { feed: { entry: entries } }}) => {
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
          const num = Number(cont.replace(',', '.'))
          const val = ( isNaN(num) ? cont : num )
          objs[cell] = val
          const row = cell.replace(/[A-Z]/g, '')
          const col = cell.replace(/[0-9]/g, '')
          if (! (row in objs)) { objs[row] = {} }
          objs[row][keys[ col + '1' ]] = val
        }
      }
      return Object.values(objs)
    })
    // only rows that have coordinates
    .then(objs => objs.filter(row =>
         typeof row.x === 'number'
      && typeof row.y === 'number'
    )),
}
