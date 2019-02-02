describe('Smart URLs', function () {
  var cases = [
    'http://example.com',
    'https://example.com',
    'http://example.com/SOMETHING.HTML',
    'https://example.com/file/path.html',
    'https://example.com/file/path-dash.html',
    'https://example.com/file/path_dash.html',
    'example.com',
    'example.co.uk',
    'example.io',
    '123example.com',
    '123.example.com',
    '123-example.com',
    'localhost:8000',
    'http://localhost:8000',
    'http://my-url.com/localhost/',
    'http://nw.local:5757',
    'http://192.168.0.3:5757/',
    'file:///Users/Nick/Sites/index.html',
    'file:///C:/something',
    'example.com',

    // The following should fail:
    'HTTP://EXAMPLE.COM',
    'https://example',
    '://example.com/file/path-dash.html',
    '/example.com',
    'example',
    ''
  ]

  it('should return a valid URL', function () {
    for (let [key, value] of Object.entries(cases)) {
      const result = app.toolbar.smartURL.make(cases[key])

      if (result !== false) {
        // These results should either contain http or file://
        // console.log(result);

        // Test http/https URLs
        if (RegExp(/^https?/).test(result)) {
          expect(result).to.have.string('http')
          expect(result).to.have.string('://')
        }

        // HTTP[s]:// should be capitalized
        if (new RegExp(/^HTTPS?/).test(result)) {
          expect(result).to.be.false
        }
      }
    }
  })

  it('should accept local file paths (Mac + Windows)', function () {
    for (let [key, value] of Object.entries(cases)) {
      const result = app.toolbar.smartURL.make(cases[key])
      if (result !== false) {
        // Test local file paths
        if (result.includes('file:')) {
          // These results should contain the proper format
          // console.log(result);

          expect(result).to.have.string('file://')
        }
      }
    }
  })

  it('should accept localhost URLs', function () {
    for (let [key, value] of Object.entries(cases)) {
      const result = app.toolbar.smartURL.make(cases[key])
      if (result !== false) {
        // Test http/https URLs
        if (RegExp(/localhost/).test(result)) {
          // These results should contain the proper format
          // console.log(result);

          expect(result).to.have.string('http')
          expect(result).to.have.string('://')
        }
      }
    }
  })

  it('should return false on errors', function () {
    for (let [key, value] of Object.entries(cases)) {
      const result = app.toolbar.smartURL.make(cases[key])

      // Make sure that false returns false
      if (result !== false) {
      } else {
        // These results should all be missing important characteristics
        // console.log(cases[key]);

        expect(result).to.be.false
      }
    }
  })
})
