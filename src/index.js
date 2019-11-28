import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mustache from 'mustache-express'
import path from 'path'
import upload from './api/upload'

const app = express()

app.use(cors())
app.use(express.static(__dirname))

app.engine('html', mustache())
app.set('view engine', 'html')
app.set('views', __dirname + '/templates')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/cornell', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/cornell-cs61a-1.html'))
})

app.get('/ssearch', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/search-results.html'))
})

app.use('/upload', upload)

app.get('/uploadinfo', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/upload-info.html'))
})

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/test.html'))
})

app.listen(3000, () => console.log(`Example app listening on port ${process.env.PORT}!`))
