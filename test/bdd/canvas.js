describe('Canvas', function () {
	var artboards = $("#artboards");
	var artboard = $(".artboard");
	var canvas = artboards.panzoom();

	it('should have DOM elements available', function () {
		expect(artboards).to.exist;
		expect(artboard).to.not.be.empty;
		expect(canvas).to.exist;
	});

	it('should let canvas zoom in', function () {
		var called = false;

		function testZoom(e, panzoom, scale) {
			called = true;
			expect(scale).to.be.a('number');
		}
		canvas.on('panzoomzoom', testZoom);
		canvas.panzoom('zoom');
		expect(called).to.be.true;
	});

	it('should let canvas zoom out', function () {
		var called = false;

		function testZoom(e, panzoom, scale) {
			called = true;
			expect(scale).to.be.a('number');
		}
		canvas.on('panzoomzoom', testZoom);
		canvas.panzoom('zoom', true);
		expect(called).to.be.true;
	});

});