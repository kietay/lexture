import speech from '@google-cloud/speech'
import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import uuid from 'uuid'
import { getConsoleOutput } from '@jest/console'

const FFPMPEG_PATH = '/usr/local/bin/ffmpeg'

export const transcribeAudio = async fp => {
  const gcsUri = await uploadToGcs(fp)

  const client = new speech.SpeechClient()
  //   const file = fs.readFileSync(fp)

  //   const audioBytes = file.toString('base64')

  const audio = {
    // content: audioBytes,
    uri: gcsUri,
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

  const [operation] = await client.longRunningRecognize(request)
  const [response] = await operation.promise()
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n')

  console.log(`Transcription: ${transcription}`)

  return response
}

export const uploadToGcs = async fp => {
  const fileName = path.basename(fp)
  const storage = new Storage()
  const bucketName = 'lexture'
  await storage.bucket(bucketName).upload(fileName, {})
  console.log(`File uploaded to GCS: ${fp}`)

  return `gs://${bucketName}/` + fileName
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

export const transcriptionToDataModel = (transResponse, videoId) =>
  transResponse.results.map(r => {
    try {
      const alt = r.alternatives[0]
      const endElem = alt.words.slice(-1)[0]
        ? alt.words.slice(-1)[0]
        : alt.words[0]
      const startTime = formatTime(alt.words[0].startTime)
      const endTime = formatTime(endElem.endTime)

      return {
        videoId: videoId,
        text: alt.transcript,
        startTimestamp: startTime,
        endTimestamp: endTime,
      }
    } catch (err) {
      console.log(`Unable to transcribe ${JSON.stringify(r.alternatives[0])}`)
      return {
        videoId: videoId,
        text: 'n/a',
        startTimestamp: '00:00:00.000',
        endTimestamp: '00:00:00.000',
      }
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
  const secs = time.seconds % 60
  const mins = time.minutes ? time.minutes : Math.floor(time.seconds / 60) % 60
  const hrs = time.hours
    ? time.hours
    : Math.floor(Math.floor(time.seconds / 60) / 60)
  return (
    String(hrs).padStart(2, '0') +
    ':' +
    String(mins).padStart(2, '0') +
    ':' +
    String(secs).padStart(2, '0') +
    '.000'
  )
}
