export function initialPan() {
  const panzoomEl = document.querySelector<HTMLElement>('.panzoom-container')
  if (!panzoomEl) {
    console.error('No container')
    return {}
  }
  const childElement = panzoomEl?.querySelector('.panzoom-inner') as HTMLElement

  const panzoomRect = panzoomEl.getBoundingClientRect()
  const childRect = childElement.getBoundingClientRect()

  const panzoomViewportRect = {
    width: panzoomEl.offsetWidth,
    height: panzoomEl.offsetHeight,
  }
  const childWidth = childRect.width
  const childHeight = childRect.height

  // Calculate the zoom scale
  const zoomPadding = 0.9 // add extra space on sides of the content
  const zoomX = (panzoomViewportRect.width / childWidth) * zoomPadding
  const zoomY = (panzoomViewportRect.height / childHeight) * zoomPadding
  const zoom = Math.min(zoomX, zoomY)

  // Pan
  const panX = (panzoomRect.width - childRect.width) / 2 - childRect.left
  const panY = (panzoomRect.height - childRect.height) / 2 - childRect.top

  // center child element within viewport
  return {
    x: panX,
    y: panY,
    zoom: zoom,
  }
}

