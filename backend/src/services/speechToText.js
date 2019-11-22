import speech from 'google-cloud/speech'
import fs from 'fs'
import videoConverter from 'video-converter'
import uuid from 'uuid'

const transcribeAudio = async fp => {
  const client = new speech.SpeechClient()
  const file = fs.readFileSync(fp)

  const audioBytes = file.toString('base64')

  const audio = {
    content: audioBytes,
  }

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-UD',
  }

  const request = {
    audio: audio,
    config: config,
  }

  const [response] = await client.recognize(request)
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n')

  console.log(`Transcription: ${transcription}`)

  return transcription
}

const convertVidToFlac = async fp => {
  videoConverter.setFfmpegPath('/usr/bin/ffmpeg', err => {
    if (err) throw err
  })

  const outPath = `temp_audio_${uuid.v4()}.flac`

  console.log(`Starting conversion for: ${fp}`)

  videoConverter.convert(fp, outPath, err => {
    if (err) throw err
    console.log(`Video conversion done for: ${fp}`)
  })
}
