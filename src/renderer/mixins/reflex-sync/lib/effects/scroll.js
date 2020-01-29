export default (ctx, event, originElement, targetElement) => {
    targetElement.scrollTop = originElement.scrollTop
    targetElement.scrollLeft = originElement.scrollLeft
}