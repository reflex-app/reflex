function popToast(message, target, color) {
  // Default message
  if ( !message ) {
    message = "This is a default toast.";
    console.log("You forgot to configure a toast message.");
  }

  var toast_jquery_element = $('' + target + '');

  if ( color ) {
    toast_jquery_element.addClass(color);
  }

  // Set the message
  toast_jquery_element.html(message);
  // Show the status
  toast_jquery_element.fadeIn();
  // After 3 seconds, hide it again
  setTimeout(function() {
    toast_jquery_element.fadeOut();
    // setTimeout(function() {
    //   toast_jquery_element.removeClass(color);
    // }, 1000);
  }, 3000);

}
