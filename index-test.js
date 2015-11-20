'use strict'

let assert = require('chai').assert
let getFile = require('./lib/get-file')

describe('getFile', function() {

  it('prevents duplicates from happening', function() {
    let files = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n'.split(',')
    let usedStrategies = 'a,b,c'.split(',')
    let filename = getFile(usedStrategies, files)
    assert.isBelow(usedStrategies.indexOf(filename), 0);
  })

})
