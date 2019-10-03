const lazy = (func) => {
  let res
  let init = false
  return () => {
    if (! init) { init = true ; res = func() }
    return res
  }
}

const storage = lazy(() => {
  const dummy = () => {
    const memory = {}
    return {
      can: () => false,
      has: (key) => key in memory && memory[key] !== null,
      get: (key) => memory[key],
      set: (key, val) => memory[key] = val,
    }
  }
  // test localStorage to work
  try {
    if (! window || ! window.localStorage) { return dummy() }
    const store = window.localStorage
    const test = Math.random().toString()
    store.setItem('store_test', test)
    if (store.getItem('store_test') !== test) { return dummy() }
    store.removeItem('store_test')
    if (store.getItem('store_test') !== null) { return dummy() }
    // it does work
    return {
      can: () => true,
      has: (key) => store.getItem(key) !== null,
      get: (key) => JSON.parse(store.getItem(key)),
      set: (key, val) => store.setItem(key, JSON.stringify(val)),
    }
  }
  catch (err) { return dummy() }
})

module.exports = {
  lazy,
  storage,
}
