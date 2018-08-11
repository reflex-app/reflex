screens.toolbar = {

    init: function() {
      this.firstLoad();
    },
  
    firstLoad: function() {
        // Bind the "Enter" key => load URL in iFrame
        $(document).on('keypress', '#toolbar__url', function(e) {
            if (e.which == 13) {
                e.preventDefault();
                screens.toolbar.updateURL();
            }
        });
    },

    updateURL: function() {
        var url_val = $("#toolbar__url").val();
        $(".artboard__content iframe").attr("src", url_val);
        console.log('Loaded: ' + url_val);
    }

}