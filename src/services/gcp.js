import speech from '@google-cloud/speech'
import { Storage } from '@google-cloud/storage'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import uuid from 'uuid'

const FFPMPEG_PATH = '/usr/local/bin/ffmpeg'

export const transcribeAudio = async fp => {
  const gcsUri = await uploadToGcs(fp)

  console.log('Audio file upload to GCS')

  const client = new speech.SpeechClient()

  const audio = {
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

  console.log('Starting transcription')

  const [operation] = await client.longRunningRecognize(request)
  const [response] = await operation.promise()
  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n')

  console.log(`Transcription: ${transcription}`)

  return response
}

export const uploadToGcs = async fp => {
  const fileName = path.basename(fp)
  const storage = new Storage()
  const bucketName = 'lexturecloud'
  await storage.bucket(bucketName).upload(fp, {})
  console.log(`File uploaded to GCS: ${fp}`)

  return `gs://${bucketName}/` + fileName
}

export const convertVid = async fp => {
  const outPath = __dirname + '/../../temp/audio/' + `temp_audio_${uuid.v4()}.flac`

  const command = ffmpeg({
    source: fp,
  }).audioChannels(1)

  console.log(`Converting video file to audio: ${fp}`)

  command.saveToFile(outPath)

  await new Promise((resolve, reject) => {
    ffmpeg({
      source: fp,
      niceness: 15
    })
      .audioChannels(1)
      .on('progress', progress => {
        console.log(`[ffmpeg] ${JSON.stringify(progress)}`)
      })
      .on('error', err => {
        console.log(`[ffmpeg] error: ${err.message}`)
        reject(err)
      })
      .on('end', () => {
        console.log('[ffmpeg] finished')
        resolve()
      })
      .saveToFile(outPath)
  })

  return outPath
}

export const transcriptionToDataModel = (transResponse, videoId) =>
  transResponse.results.map(r => {
    try {
      const alt = r.alternatives[0]
      const endElem = alt.words.slice(-1)[0] ? alt.words.slice(-1)[0] : alt.words[0]
      const startTime = alt.words[0] ? alt.words[0].startTime.seconds : 0
      const endTime = endElem ? endElem.endTime.seconds : 0

      return {
        videoId: videoId,
        text: alt.transcript,
        startTimestamp: startTime,
        endTimestamp: endTime,
      }
    } catch (err) {
      console.log(`Unable to transcribe ${JSON.stringify(r.alternatives[0])}`)
    }
      return {
        videoId: videoId,
        text: '',
        startTimestamp: 0,
        endTimestamp: 0,
      }
  })

export const transcriptionToVtt = transResponse => {
    const header = `WEBVTT\n\n`
  const body = transResponse.results.map((r, ind) => {
    const lineNum = ind + 1
    const alt = r.alternatives[0]

    const startTime = formatTime(alt.words[0] ? alt.words[0].startTime : 0)
    const endTime = formatTime(alt.words.slice(-1)[0] ? alt.words.slice(-1)[0].endTime : 0)


    return `${lineNum}\n${startTime} --> ${endTime}\n${alt.transcript}\n\n`
  }).join("")

  return header + body
}

export const formatTime = time => {
  const secs = time.seconds % 60
  const mins = time.minutes ? time.minutes : Math.floor(time.seconds / 60) % 60
  const hrs = time.hours ? time.hours : Math.floor(Math.floor(time.seconds / 60) / 60)
  return (
    String(hrs).padStart(2, '0') +
    ':' +
    String(mins).padStart(2, '0') +
    ':' +
    String(secs).padStart(2, '0') +
    '.000'
  )
}
