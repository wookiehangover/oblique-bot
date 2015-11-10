var casper = require('casper').create({
  clientScripts: [
    'node_modules/es5-shim/es5-shim.js'
  ],
  viewportSize: {
    width: 512,
    height: 512
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
  var strategy = this.getHTML('#strategy')
  var filename = strategy.toLowerCase().replace(/\s/g, '-') || 'fallback'
  this.capture('assets/' + filename + '.png')
})

casper.run()
