const screenshot = (filename, container, marker, row) => {
  const div = L.DomUtil.create('div', 'pine-screenshot', container)

  const a = L.DomUtil.create('a', '', div)
  a.setAttribute('href', `${__WIKI__}File:${filename}`)
  a.setAttribute('target', '_blank')

  const img = L.DomUtil.create('img', '', a)
  img.setAttribute('referrerpolicy', 'no-referrer')
  img.setAttribute('src', `${__WIKI__}Special:Redirect/file/${filename}?width=240&height=240`)

  // update the popup, to adjust it's size to the image (but only once!)
  if (! row.screenshot_html) {
    img.onload = () => {
      row.screenshot_html = 'loaded'
      if (marker._popup) { marker._popup.update() }
    }
  }
}

module.exports = {
  screenshot,
}
