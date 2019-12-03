import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mustache from 'mustache-express'
import path from 'path'
import upload from './api/upload'
import video from './api/video'
import search from './api/search'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

mongoose.set('useCreateIndex', true)

const app = express()

app.use(cors())
app.use(express.static(__dirname))

app.engine('html', mustache())
app.set('view engine', 'html')
app.set('views', __dirname + '/templates')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/viewsOld/index.html'))
})

app.use('/upload', upload)
app.use('/video', video)
app.use('/search', search)

app.get('/uploadinfo', (req, res) => {
  res.sendFile(path.join(__dirname + '/viewsOld/upload-info.html'))
})

mongoose
  .connect(process.env.MONGO_ENDPOINT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to mongo')
    app.listen(3000, () => console.log(`Example app listening on port ${process.env.PORT}!`))
  })
  .catch(err => console.log(err))
