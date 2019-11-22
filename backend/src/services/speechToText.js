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
    encoding: 'FLAC',
    languageCode: 'en-US',
    enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
    model: 'video',
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

  return response
}

export const convertVid = async fp => {
  const outPath = `temp_audio_${uuid.v4()}.flac`

  const command = ffmpeg({
    source: fp,
  })
    .audioChannels(1)
    .output(outPath)

  console.log(`Converting video file to audio: ${fp}`)

  await command.run()

  return outPath
}

export const transcriptionToDataModel = transResponse =>
  transResponse.results.map(r => {
    const alt = r.alternatives[0]
    const startTime = formatTime(alt.words[0].startTime)
    const endTime = formatTime(alt.words.slice(-1)[0].endTime)

    return {
      text: alt.transcript,
      startTimestamp: startTime,
      endTimestamp: endTime,
    }
  })

export const transcriptionToVtt = transResponse =>
  transResponse.results.map((r, ind) => {
    const lineNum = ind + 1
    const alt = r.alternatives[0]

    const startTime = formatTime(alt.words[0].startTime)
    const endTime = formatTime(alt.words.slice(-1)[0].endTime)

    return `${lineNum}\n${startTime} --> ${endTime}\n${alt.transcript}\n\n`
  })

export const formatTime = time => {
  const hrs = time.hours ? time.hours : '0'
  const mins = time.minutes ? time.minutes : '0'
  return (
    String(hrs).padStart(2, '0') +
    ':' +
    String(mins).padStart(2, '0') +
    ':' +
    String(time.seconds).padStart(2, '0') +
    '.000'
  )
}
