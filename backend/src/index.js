import 'dotenv/config'
import cors from 'cors'
import express from 'express'
// console.log('Hello Project. new');
// console.log(process.env.MY_SECRET);
// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World111\n');
// }).listen(3000, "142.93.4.210");
// console.log('Server running at http://142.93.4.210:3000/');

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
)
