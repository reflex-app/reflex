var recentURLs = JSON.parse(localStorage.getItem('recentURLs')) || [];
console.log("recentURLs: " + recentURLs);

function addToRecentURLs(e) {
    var e = $(e.target).text();

    // Add to existing
    if (recentURLs.length >= 1) {
        recentURLs.push('more than 1');

        // Make sure there's only 5 recent items
        // Remove the oldest items
        if (recentURLs.length > 5) {
            recentURLs.shift();
        }

        localStorage.setItem('recentURLs', JSON.stringify(recentURLs));
    } else if (recentURLs.length < 1 || recentURLs == null ) {
        recentURLs.push('something new');
        localStorage.setItem('recentURLs', JSON.stringify(recentURLs));
    }

    // Add to LocalStorage
    // localStorage.setItem('recentURLs', JSON.stringify(e));
    console.log(JSON.parse(localStorage.getItem('recentURLs')));
}

// var taste = localStorage.getItem('favoriteflavor');
// console.log(taste);


// On read
if (localStorage["recentURLs"]) {
    // LocalStorage exists
    console.log('it exists');
}


$("#localstorage").on('click', function (e) {
    addToRecentURLs(e);
    console.log('fired');
});




// var pastSearches = [];

// // Check if LocalStorage key exists
// if (localStorage["pastSearches"]) {
//      pastSearches = JSON.parse(localStorage["pastSearches"]);
// }

// // Search within the LocalStorage
// if (pastSearches.indexOf(search) == -1) {
//     pastSearches.unshift(search);
//     // If more than x items, remove the oldest one
//     if (pastSearches.length > 10) { 
//        pastSearches.pop();
//     }
//     localStorage["pastSearches"] = JSON.stringify(pastSearches);
// }

// function drawPastSearches() {
//     if (pastSearches.length) {
//         var html = pastSearches;
//         // var html = pastSearchesTemplate({search:pastSearches});
//         $("#localstorage").html(html);
//     }
// }

// $("#localstorage").on("click", function(e) {
//     e.preventDefault();
//     var search = $(this).text();
//     doSearch(search);
// });