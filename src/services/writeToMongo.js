import Caption from '../models/Caption'

export const writeCaption = caption => {
  const cap = new Caption(caption)
  cap.save(function(err) {
    if (err) console.log(err)
  })
}
