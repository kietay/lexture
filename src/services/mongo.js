import Caption from '../models/Caption'

export const writeCaption = caption =>
  new Caption(caption).save(err => {
    if (err) console.log(err)
  })
