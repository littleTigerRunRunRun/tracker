const _throttles = []
export function throttle(func, interval) {
  const index = _throttles.length
  _throttles.push({
    start: Date.now(),
    timer: null
  })
  return function() {
    const throt = _throttles[index]
    const argu = arguments
    if (Date.now() < throt.start + interval) {
      if (throt.timer) clearTimeout(throt.timer)
      throt.timer = setTimeout(() => {
        func.apply(this, argu)
      }, throt.timer + throt.start - Date.now())
    }
  }
}
