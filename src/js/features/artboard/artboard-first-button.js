export default function createFirstNewButton () {
  $('.button-artboard-before').remove()
  return artboard.first().prepend("<div class='button-artboard-before'>+</div>")
}
