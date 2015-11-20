'use strict'

let _ = require('lodash')
let Twit = require('twit')
let T = new Twit(require('./config.js'))
let fs = require('fs')
let path = require('path')
let getFile = require('./lib/get-file')

function setUsedStrategies(color, cb) {
  getUsedStrategies((err, usedColors) => {
    if (err) {
      return cb(err)
    }

    usedColors.push(color)

    fs.writeFile('used-strategies.json', JSON.stringify(usedColors, null, 2), (fileErr) => {
      if (fileErr) {
        return cb(fileErr)
      }
      cb(null, usedColors)
    })
  })
}

function getUsedStrategies(cb) {
  fs.readFile('./used-strategies.json', 'utf8', function(err, data) {
    if (err) {
      cb(err)
    }

    cb(null, JSON.parse(data))
  })
}

function getStrategy(done) {
  fs.readdir(path.join(__dirname, 'assets'), function(err, files) {
    if (err) {
      console.log('error: ', err)
      return
    }

    getUsedStrategies(function(err, usedStategies) {
      if (err) {
        console.log('error: ', err)
        return
      }
      let name = getFile(
        usedStategies,
        _.without(files, '.gitkeep', '.DS_Store')
      )
      done(name)
    })

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

    T.post('statuses/update', params, (twitterErr) => {
      if (twitterErr) {
        console.log('error:', twitterErr)
        return
      }

      setUsedStrategies(name, (fileErr) => {
        if (err) {
          console.log('error: ', fileErr)
          return
        }
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
// setInterval(function () {
//   try {
//     tweet()
//   }
//   catch (e) {
//     console.log(e)
//   }
// }, 1000 * 60 * 60 * 4)

// Tweet once on initialization
tweet()
