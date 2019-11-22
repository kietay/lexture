import speech from '@google-cloud/speech'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import uuid from 'uuid'

const FFPMPEG_PATH = '/usr/local/bin/ffmpeg'

export const transcribeAudio = async fp => {
  const client = new speech.SpeechClient()
  const file = fs.readFileSync(fp)

  const audioBytes = file.toString('base64')

  const audio = {
    content: audioBytes,
  }

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
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

export const convertVid = async fp => {
  const outPath = `temp_audio_${uuid.v4()}.flac`

  const command = ffmpeg({
    source: fp,
  }).output(outPath)

  console.log(`Converting video file to audio: ${fp}`)

  await command.run()

  return outPath
}
