function documentHeight() {
  // via https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
  const body = document.body
  const html = document.documentElement

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )
}

module.exports = {
  documentHeight,
}
