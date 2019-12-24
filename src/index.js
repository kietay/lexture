import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mustache from 'mustache-express'
import upload from './api/upload'
import video from './api/video'
import search from './api/search'
import course from './api/course'
import { auth } from './api'
import { samlStrategy, ensureAuthenticated, passport } from './api/auth'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import session from 'express-session'

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

app.get('/', ensureAuthenticated, (req, res) => {
  res.render('index')
})

app.use('/upload', upload)
app.use('/video', video)
app.use('/search', search)
app.use('/course', course)
app.use('/auth', auth)

app.get('/uploadinfo', (req, res) => {
  res.render('upload-info')
})

mongoose
  .connect(process.env.MONGO_ENDPOINT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to mongo')
    app.listen(3000, () => console.log(`Example app listening on port ${process.env.PORT}!`))
  })
  .catch(err => console.log(err))
