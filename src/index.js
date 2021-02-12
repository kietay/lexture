import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mustache from 'mustache-express'
import upload from './api/upload'
import video from './api/video'
import search from './api/search'
import course from './api/course'
import { auth } from './api'
import { ensureAuthenticated, passport } from './api/auth'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import session from 'express-session'
import fs from 'fs'

const tempdirs = ['./temp', './temp/audio', './temp/video', './temp/transcripts']

// Create these temp dirs if not already existing
tempdirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  } else {
  }
})

mongoose.set('useCreateIndex', true)

const app = express()

app.use(
  cors({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
)

app.use(express.static(__dirname))

app.engine('html', mustache())
app.set('view engine', 'html')
app.set('views', __dirname + '/templates')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/upload', ensureAuthenticated, upload)
app.use('/video', video)
app.use('/search', search)
app.use('/course', ensureAuthenticated, course)
app.use('/auth', auth)

// todo this should be moved out into appropriate route
app.get('/uploadinfo', (req, res) => {
  res.render('upload-info')
})

var mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin',
}

mongoose
  .connect(process.env.MONGO_ENDPOINT, mongooseOptions)
  .then(() => {
    console.log('Connected to mongo')
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`)
    )
  })
  .catch(err => console.log(err))
