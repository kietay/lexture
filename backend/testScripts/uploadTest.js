import { upload, uploadDir } from '../src/services/uploadToSpaces'
import {
  transcribeAudio,
  transcriptionToVtt,
  transcriptionToDataModel,
} from '../src/services/speechToText'
import fs from 'fs'

const fp = '/Users/kieran/projects/lexture/backend/temp_audio.flac'

const t = transcribeAudio(fp).then(x => {
  const path = 'sample_out.txt'
  const writeStream = fs.createWriteStream(path)
  writeStream.write(JSON.stringify(x))
  const y = transcriptionToDataModel(x)
  writeStream.write('[')
  y.forEach(line => {
    console.log(line)
    writeStream.write(JSON.stringify(line) + ',')
  })
  writeStream.write(']')
  writeStream.end()
})

// upload(fp)(uploadDir('12345'))
