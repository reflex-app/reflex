export default function scrollHandler(origin, x, y) {
  // https://stackoverflow.com/a/27915353/1114901

  const scrollProportion = ({ val, direction }) => {
    if (direction === 'x') {
      // Percentage scrolled (for the origin)
      const percentage = val / (origin.viewportWidth - origin.offsetWidth)

      // The relative amount to scroll for this page
      const localViewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      )
      return (
        percentage * (document.documentElement.scrollWidth - localViewportWidth)
      )
    } else if (direction === 'y') {
      // Percentage scrolled (for the origin)
      const percentage = val / (origin.viewportHeight - origin.offsetHeight)

      // The relative amount to scroll for this page
      const localViewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
      return (
        percentage *
        (document.documentElement.scrollHeight - localViewportHeight)
      )
    }
  }

  // Scroll proportionally
  // That means of the total height, scroll x% (as a numeric value)
  window.scrollTo(
    scrollProportion({ val: x, direction: 'x' }),
    scrollProportion({ val: y, direction: 'y' })
  ) // % of y axis of scroll to px
}
