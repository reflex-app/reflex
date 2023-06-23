import { expect, test, describe } from 'vitest'
import autoCorrectURL from '../autoCorrectURL'

describe('Smart URLs', function () {
  const cases = [
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
    'HTTP://EXAMPLE.COM', // Will be converted to lowercase

    // The following should fail:
    'https://example', // no domain provided
    '://example.com/file/path-dash.html', // no protocol provided
    '/example.com', // no protocol provided
    'example', // no protocol or domain
    ' ', // empty space
  ]

  test('should return only valid URLs', async () => {
    for (const c in cases) {
      try {
        const result = await autoCorrectURL(cases[c])

        if (result !== 'undefined' || result !== false) {
          // These results should either contain http or file://
          if (new RegExp(/^https/).test(result)) {
            expect(result).toContain('https://')
          } else if (new RegExp(/^http/).test(result)) {
            expect(result).toContain('http://')
          } else if (new RegExp(/^file/).test(result)) {
            expect(result).toContain('file://')
          }
          // console.log(result)
        }
      } catch (err) {
        // console.log('Failed:', cases[c])
      }
    }
  })
})
