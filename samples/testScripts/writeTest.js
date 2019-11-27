import fs from 'fs'
import { writeToMongo } from '../src/services/writeToMongo'

fs.readFile('sampleData/cornell_transcript.json', 'utf8', function(err, data) {
  if (err) console.log(err)
  const caps = JSON.parse(data)
  caps.forEach(cap => {
    writeToMongo(cap)
  })
})
