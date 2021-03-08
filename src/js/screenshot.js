const screenshot = (filename, container) => {
  const div  = L.DomUtil.create('div', 'pine-screenshot', container)
  const wrap = L.DomUtil.create('div', '', div)

  // img.referrerpolicy doesn't work in IE11, so put it into an iframe with meta.referrer = never
  const iframe = L.DomUtil.create('iframe', '', wrap)
  // contentDocument is only available after the iframe has been added to the DOM, which will happen later, so we have to call the code later with onload
  iframe.onload = () => {
    iframe.onload = undefined
    iframe.contentDocument.write(
      '<html><head>'
      + '<meta name="referrer" content="never">'
      + '<style>*{overflow:hidden;margin:0;}</style>'
      + '</head><body>'
      + `<a href="${__WIKI__}File:${filename}" target="_blank">`
      + `<img src="${__WIKI__}Special:Redirect/file/${filename}?width=240&height=240" referrerpolicy="no-referrer">`
      + '</a></body></html>'
    )
    // stop browser thinking it's infinite loading
    iframe.contentDocument.close()
    // set the size based on the image dimensions
    const img = iframe.contentDocument.querySelector('img')
    const set = () => {
      img.onload = undefined
      iframe.style.width  = img.width  + 'px'
      iframe.style.height = img.height + 'px'
      wrap.style.width    = img.width  + 'px'
      wrap.style.height   = img.height + 'px'
    }
    // if the image is already loaded, we can set the size immediately
    if (img.complete) { set() }
    else { img.onload = set }
  }
}

module.exports = {
  screenshot,
}
