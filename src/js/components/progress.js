// via: https://codepen.io/thathurtabit/pen/ymECf?editors=1111
var progress_bar = (function () {

	// Configure the progress bar
	var progressBarEl = $("#progress");
	var progressBarTextEl = $(".progress-text");

	// Keep track of it's running
	var isRunning = false;

	// Variables for progress
	var track_progress,
	total_progress,
	track_progress_old,
	progress_completed,
	checkProgressInterval,
	getPercent,
	getProgressWrapWidth,
	progressTotal,
	animationLength;

	// Variables for the progress bar
	var width, curr_width, difference;


	// Create a new progress bar
	newProgressBar();

	// Process:
	// undefined --> number --> undefined

	// Set an interval to check the progress
	checkProgressInterval = setInterval(function() {

		// Fetch the progress from the server's process
		track_progress = process.mainModule.exports.scrapeProgress;
		total_progress = process.mainModule.exports.scrapeProgressTotal;

		console.log("Track progress:" + track_progress + "Total progress:" + total_progress);

		// Once the variables exist...
		if ( track_progress && total_progress ) {

			if ( track_progress < total_progress ) {

				console.log('less than total', isRunning);

				// Let the app know the progress is running
				isRunning = true;

				// When there's a new number, animate it
				var temp = process.mainModule.exports.scrapeProgress;
				if ( temp != track_progress_old ) {
					// Update the number
					track_progress = process.mainModule.exports.scrapeProgress;
					// Animate the change
					updateProgressBar();
				} else {
					track_progress = process.mainModule.exports.scrapeProgress;
				}

				total_progress = process.mainModule.exports.scrapeProgressTotal;

				// Update the old variable
				track_progress_old = track_progress;

				// console.log(progress_completed + "Running...", "Track progress:" + track_progress + "Track progress old:" + track_progress_old + "Total progress:" + total_progress);

			} else if ( track_progress >= total_progress ) {

				// Update the progress
				updateProgressBar();

				// Done!
				console.log('Progress Completed!');
				boomerang.results.updateIfChanged();
				resetProgressBar();
				toggle_GUI_sync_icon();

				// Stop running
				isRunning = false;
			}


			// If variables are NOT set...
		} else {
			isRunning = false;
			progressBarTextEl.text("Loading...");

			// When the progress is still undefined (or reset)...
			if ( track_progress == undefined && total_progress == undefined ) {
				console.log('Progress is undefined', track_progress, total_progress);
			}
		}


	}, 100); // check every 100ms



	//
	// Toggle the syncing icon on/off
	//
	function toggle_GUI_sync_icon() {
		$(".gui-sync-container").find(".gui-icon-sync").toggleClass('animate spin');
	}


	/**
	* newProgressBar - description
	*
	* @return {type}  description
	*/
	function newProgressBar() {
		progressBarEl.addClass('is-active');
		toggle_GUI_sync_icon();
		// progress_completed = null;
	}


	/**
	* updateProgressBar - description
	*
	* @return {type}  description
	*/
	function updateProgressBar() {
		if ( track_progress && total_progress ) {
			$(".progress").show();

			progressBarTextEl.text(track_progress +  " of " + total_progress);
			console.log("Progress: " + track_progress + " of " + total_progress );

			width = (track_progress / total_progress) * 100;
			curr_width = track_progress_old * 10;
			difference = (width - curr_width);

			// Update the progress
			$(".progress").data("progress-percent", width);
			moveProgressBar();
		} else {
			progressBarTextEl.text("Loading...");
		}

	}


	/**
	* moveProgressBar - description
	*
	* @return {type}  description
	*/
	function moveProgressBar() {
		console.log("moveProgressBar fired");

		getPercent = ($('.progress-wrap').data('progress-percent') / 100);
		getProgressWrapWidth = $('.progress-wrap').width();
		progressTotal = getPercent * getProgressWrapWidth;
		animationLength = 300;

		// on page load, animate percentage bar to data percentage length
		// .stop() used to prevent animation queueing
		$('.progress-bar').stop().animate({
			left: progressTotal
		}, animationLength);
	}



	/**
	* resetProgressBar - resets to default state
	*
	* @return {type}  description
	*/
	function resetProgressBar() {

		$(".progress").addClass('is-complete');

		clearInterval(checkProgressInterval);

		// completely remove classes from last progress bar
		setTimeout(function() {
			emptyProgressBar();
		}, 1000);
	}


	/**
	* emptyProgressBar - description
	*
	* @return {type}  description
	*/
	function emptyProgressBar() {

		width = "";
		progressTotal = "";

		track_progress = "";
		total_progress = "";

		progress_completed = undefined;

		progressBarEl.removeClass('is-active');

		progressBarTextEl.text("");

		$(".progress").data("progress-percent", width);
		$(".progress").removeClass('is-complete');
		$(".progress").css("left", "0");
		$(".progress").hide();

		console.log("Track progress:" + track_progress + "Total progress:" + total_progress);
		console.log("All progressBar variables were reset.");
	}



});
