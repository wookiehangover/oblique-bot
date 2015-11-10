'use strict'

let _ = require('lodash')
let Twit = require('twit')
let T = new Twit(require('./config.js'))
let fs = require('fs')
let path = require('path')
let usedStategies = require('./used-strategies.json')

function getFile(files) {
  var name = files[_.random(files.length - 1)]

  // Don't repeat yourself. That's your only rule.
  if (usedStategies.indexOf(name) >= files.length - 10) {
    return getFile(files)
  }

  return name
}

function getStrategy(done) {
  fs.readdir(path.join(__dirname, 'assets'), function(err, files) {
    if (err) {
      console.log('error: ', err)
      return
    }

    var name = getFile(_.without(files, '.gitkeep', '.DS_Store'))
    done(name)
  })
}

function getMedia(name, done) {
  let filename = `assets/${name}`
  fs.readFile(filename, { encoding: 'base64' }, (err, media) => {
    if (err) {
      console.log('error:', err)
      return
    }
    done(media)
  })
}

function postMedia(name, media) {
  T.post('media/upload', { media_data: media }, (err, data) => {
    if (err) {
      throw err
    }

    let mediaIdStr = data.media_id_string
    let params = {
      status: '',
      media_ids: [mediaIdStr]
    }

    T.post('statuses/update', params, (err, data) => {
      if (err) {
        console.log('error:', err)
        return
      }

      usedStategies.push(name)

      fs.writeFile('used-strategies.json', JSON.stringify(usedStategies, null, 2), (err) => {
        console.log(`Successfully tweeted: ${name}`)
      })
    })
  })
}

function tweet() {
  getStrategy((strategy) => {
    console.log(strategy)
    getMedia(strategy, (media) => {
      postMedia(strategy, media)
    })
  })
}

// Tweet every 4 hours
setInterval(function () {
  try {
    tweet()
  }
  catch (e) {
    console.log(e)
  }
}, 1000 * 60 * 60 * 4)

// Tweet once on initialization
tweet()
