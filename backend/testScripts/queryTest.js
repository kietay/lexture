import { searchTranscripts } from '../src/services/queryMongo'
import mongoose from 'mongoose'
import 'dotenv/config'

mongoose
  .connect(process.env.MONGO_ENDPOINT, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to mongo')
  })
  .catch(err => console.log(err))

const x = searchTranscripts('adaboost')

x.then(y => console.log(JSON.stringify(y)))
