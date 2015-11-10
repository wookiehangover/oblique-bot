var casper = require('casper').create({
  clientScripts: [
    'node_modules/es5-shim/es5-shim.js'
  ],
  viewportSize: {
    width: 960,
    height: 800
  },
  verbose: true,
  logLevel: "debug"
})

casper.start('http://obliquestrategies.website', function enableUnsplash() {
  this.click('input[name="unsplash"]')
})

casper.thenEvaluate(function setBackground() {
  document.querySelector('.controls').remove()
})

casper.wait(5000, function captureScreenshot() {
  var filename = this.getHTML('#strategy').toLowerCase().replace(/\s/g, '-') || 'fallback'
  this.capture('assets/' + filename + '.png')
})

casper.run()
