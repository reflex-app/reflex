// Close the window button
$('.gui-menu-button:nth-child(1)').click(function () {
    win.close();
});

// Minimize window button
$('.gui-menu-button:nth-child(2)').click(function () {
    win.minimize();
});

// Toggle fullscreen button
$('.gui-menu-button:nth-child(3)').click(function () {
    win.toggleFullscreen();
});