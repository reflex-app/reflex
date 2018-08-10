#!/bin/bash
cd /Users/$USER/Sites/fetch/src/app
node scrape.js & php -S 127.0.0.1:8000
