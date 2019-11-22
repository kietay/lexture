import { upload, uploadDir } from './uploadToSpaces'
import {
  transcribeAudio,
  transcriptionToVtt,
  transcriptionToDataModel,
} from './speechToText'

const fp = '/Users/kieran/projects/lexture/backend/temp_audio.flac'

const t = transcribeAudio(fp).then(x => {
  const y = transcriptionToDataModel(x)
  y.forEach(line => console.log(line))
})

// upload(fp)(uploadDir('12345'))
