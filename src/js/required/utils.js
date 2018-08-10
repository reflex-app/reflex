//
// Copy to clipboard
//
function copyTextToClipboard(text) {
  var textArea = document.createElement( "textarea" );
  textArea.value = text;
  document.body.appendChild( textArea );

  textArea.select();

  try {
    var successful = document.execCommand( 'copy' );
    var msg = successful ? 'successfully' : 'unsuccessfully';
    console.log('Text copied ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild( textArea );
}
