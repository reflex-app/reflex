// @TODO: Refactor/simplify this
export default function (url) {
  return new Promise((resolve, reject) => {
    if (typeof url !== 'string') {
      throw new TypeError(
        `Expected url to be of type string, got ${typeof url}`
      )
    }

    let hasHttpPrefix = false
    let hasDot = false
    let hasLocalhost = false
    let hasLocalPath = false

    // Convert URL to lowercase
    url = url.toLowerCase()

    // Step 1: Does it have http:// or https:// ?
    // The "?" in the Regex accepts http or https
    if (new RegExp(/^https?/).test(url) === true) {
      hasHttpPrefix = true
    }

    // Step 2: Does it have .* (i.e. ".com") ?
    if (url.includes('.') === true) {
      hasDot = true
    }

    // Step 3: Does it include "localhost"?
    if (url.includes('localhost') === true) {
      hasLocalhost = true
    }

    // Step 4: Does it include:
    // Mac: "file://"
    // Windows: "file:///C:/"
    if (url.includes('file://') === true) {
      hasLocalPath = true
    }

    // Handle localhost URLs
    if (hasLocalhost) {
      if (hasHttpPrefix) {
        // Example: http://localhost:8000
        resolve(url)
      } else {
        url = 'http://' + url
        resolve(url)
      }
    }

    // Handle local paths
    if (hasLocalPath) {
      // Example: file:///users/nick/sites/index.html
      resolve(url)
    }

    // Handle non-localhost URLs
    if (hasHttpPrefix && hasDot) {
      // Perfect format:
      // http[s]://example.com
      resolve(url)
    } else if (hasHttpPrefix === false && hasDot === true) {
      // Case: example.com
      // Check if URL starts with anything besides a letter or digit
      if (new RegExp(/^[0-9a-z]/).test(url) === false) {
        reject()
      } else {
        // TODO: Default should be http
        // The URL can be prepended by https://
        url = 'http://' + url
        resolve(url)
      }
    } else {
      // Empty string or unknown error
      // Example: alert(url + " is not a valid URL.");
      reject()
    }
  })
}
