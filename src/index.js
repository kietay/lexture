import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import path from 'path'

const app = express()

app.use(cors())

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/cornell', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/cornell-cs61a-1.html'))
})

app.get('/ssearch', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/search-results.html'))
})

app.listen(3000, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
)
