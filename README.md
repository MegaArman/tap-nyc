# tap-nyc
nyc compatible TAP output formatter. 

I made this module because I like the Tape testing framework which produces
TAP output. Unfortunately the existing TAP formatters I found never played well with the nyc code coverage module 
(https://www.npmjs.com/package/nyc)
as they either produced errors or produced incorrect looking output. Lastly, I only want to see output from my
output-formatter if a test fails as the output from nyc can already be bulky on its own.

## how to use with tapejs and nyc
nyc tape tests/*.js | tap-nyc
