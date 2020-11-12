const colors = {}
const listens = {}
let colorId = 0

export function defineColor(id, obj) {
  colors[id] = obj
  if (!listens[id]) listens[id] = []
}

export function broadcastColor(id, obj) {
  for (const callback of listens[id]) {
    callback(obj)
  }
}

export function listenColor(id, callback) {
  if (!listens[id]) listens[id] = []
  listens[id].push(callback)
}

export function removeListenColor(id, callback) {
  const listen = listens[id]
  if (!listen) return
  listen.splice(listen.indexOf(callback), 1)
}

export function fetchColor(id) {
  return colors[id]
}

export function fetchId() {
  return `globalGradientId${colorId++}`
}
