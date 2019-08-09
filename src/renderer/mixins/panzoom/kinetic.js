// Provides inertia on an element when dragged
export default function kinetic(getPoint, scroll, context, settings) {
  if (typeof settings !== 'object') settings = {}

  // TODO: Add settings
  // var minVelocity = (typeof settings.minVelocity === 'number') ? settings.minVelocity : 5
  // var amplitude = (typeof settings.amplitude === 'number') ? settings.amplitude : 0.25

  var view, indicator, relative,
    min, max, offset, reference, pressed, xform,
    velocity, frame, timestamp, ticker,
    amplitude, target, timeConstant

  // function ypos(e) {
  //   // touch event
  //   if (e.targetTouches && (e.targetTouches.length >= 1)) {
  //     return e.targetTouches[0].clientY;
  //   }

  //   // mouse event
  //   return e.clientY;
  // }

  // function scroll(y) {
  //   offset = (y > max) ? max : (y < min) ? min : y;
  //   view.style[xform] = 'translateY(' + (-offset) + 'px)';
  //   indicator.style[xform] = 'translateY(' + (offset * relative) + 'px)';
  // }

  function track() {
    var now, elapsed, delta, v

    now = Date.now()
    elapsed = now - timestamp
    timestamp = now
    delta = offset - frame
    frame = offset

    v = 1000 * delta / (1 + elapsed)
    velocity = 0.8 * v + 0.2 * velocity
  }

  function autoScroll() {
    var elapsed, delta

    if (amplitude) {
      elapsed = Date.now() - timestamp
      delta = -amplitude * Math.exp(-elapsed / timeConstant)
      if (delta > 0.5 || delta < -0.5) {
        scroll(target + delta)
        requestAnimationFrame(autoScroll)
      } else {
        scroll(target)
      }
    }
  }

  function start(e) { // Start event
    reference = ypos(e) // This is where the touch event occurred

    // Set some initial info
    velocity = amplitude = 0
    frame = offset
    timestamp = Date.now()
    clearInterval(ticker)
    ticker = setInterval(track, 100)
  }

  function activate(e) { // Active event
    let y, delta
    y = ypos(e)
    delta = reference - y
    if (delta > 2 || delta < -2) {
      reference = y
      scroll(offset + delta)
    }
  }

  function stop(e) { // End event
    clearInterval(ticker)
    if (velocity > 10 || velocity < -10) {
      amplitude = 0.8 * velocity
      target = Math.round(offset + amplitude)
      timestamp = Date.now()
      requestAnimationFrame(autoScroll)
    }
  }

  view = context.parent // The space available to drag
  max = parseInt(getComputedStyle(view).height, 10) - innerHeight
  offset = min = 0
  timeConstant = 325 // ms

  indicator = document.getElementById('indicator')
  relative = (innerHeight - 30) / max

  xform = 'transform'
}
