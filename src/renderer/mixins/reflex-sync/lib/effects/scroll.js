const scroll = (origin, x, y) => {
  // https://stackoverflow.com/a/27915353/1114901

  const scrollProportionY = () => {
    // Percentage scrolled (for the origin)
    const percentage = y / (origin.viewportHeight - origin.offsetHeight)

    // The relative amount to scroll for this page
    const localViewportHeight = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    return (
      percentage * (document.documentElement.scrollHeight - localViewportHeight)
    )
  }

  // Scroll proportionally
  // That means of the total height, scroll x% (as a numeric value)
  window.scrollTo(0, scrollProportionY()) // % of y axis of scroll to px
}

module.exports = scroll
