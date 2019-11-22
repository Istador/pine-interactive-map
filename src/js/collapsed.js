let expandedGroups = null
let name2type = {}


// remember collapsed groups
const rememberCollapsed = () => {
  expandedGroups = {}
  const titles = document.querySelectorAll('div.leaflet-panel-layers-group.expanded > label > span.leaflet-panel-layers-title')
  for (const title of titles) {
    const type = name2type[title.innerHTML]
    expandedGroups[type] = true
  }
}

const isCollapsed = (type) => {
  // reinit due to version or language change
  if (expandedGroups !== null) {
    // collapse how it was before
    return ! (type in expandedGroups)
  }
  // first run
  return null
}

const resetCollapsed = () => {
  name2type = {}
}

const addCollapsed = (type, name) => {
  name2type[name] = type
}

module.exports = {
  rememberCollapsed,
  isCollapsed,
  resetCollapsed,
  addCollapsed,
}
