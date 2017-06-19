# tap-nyc
nyc compatible TAP output formatter. 

I made this package because I like the Tape testing framework which produces
TAP output, but unfortunately the existing TAP formatters I found never played well with the nyc code coverage module 
(https://www.npmjs.com/package/nyc)
as they either produced errors or produced incorrect looking output. Further, I only want to see minimal output from my
TAP formatter when all tests pass, as the output from nyc can already be bulky on its own.

## install
To install as a developer dependency:

    npm install tap-nyc --save-dev

## example usage with tapejs and nyc
Put the following in your package.json:

    "scripts": {
      "test": "nyc tape tests/*.js | tap-nyc"
    },
    
Here's output I get for one of my projects when I run "npm t":

![](https://raw.githubusercontent.com/MegaArman/npm_images/master/tapnyc.png)

