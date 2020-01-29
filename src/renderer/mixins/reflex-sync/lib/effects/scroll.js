module.exports = function (x, y) {
    if (window.scrollY === y) return false
    window.scrollTo(x, y)
}