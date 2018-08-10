//
//
// Convert timestamp
//
//
function convert_timestamp(input) {

	if (input) {

		try {
			var val = input;
			var timestamp = moment(val).format('YYYY-MM-DD HH:mm:ss');
		}
		catch(err) {
			console.log("Not a time! Ignored.");
		}

		// Convert format
		var timestamp = moment(input).format('YYYY-MM-DD HH:mm:ss');
		var fromNow = moment(timestamp).fromNow();

		// Return the number
		return fromNow;

		// Testing
		// console.log("Timestamp var:" + timestamp);
		// console.log("Difference:" + fromNow);
	}

}


//
//
// Update timeAgo timestamp
//
//
function update_timestamp() {
	$('.timestamp-ago').each(function() {
		if ( !$(this).hasClass('is-loaded') ) {
			$(this).addClass('is-loaded');
		}

		// Set the initial time
		var value = $(this).data('timestamp');
		// Set the format to 2017-03-18 20:32:12
		var timestamp_format = moment(value).format('YYYY-MM-DD HH:mm:ss');
		// Convert to "12 minutes ago" format
		var fromNow = moment(timestamp_format).fromNow();

		// Push to DOM elements
		$(this).html(fromNow);
	});
}


// When jQuery loads, run the following:
$(function() {

	// Set the initial time after loading
	setTimeout(function() {
		update_timestamp();
		// console.log('time');
	}, 100);

	// Every minute, update the timestamps
	function update_timestamp_every_minute() {
		setInterval(function(){
			update_timestamp();
		}, 60000);
	}
	update_timestamp_every_minute();
});
