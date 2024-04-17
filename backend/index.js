//dependencies
const express = require('express')

//config -- express
const app = express()

// change of port if needed
const port = 3000


//endpoint
app.get('/', (request, response) => {
  response.send('Hello World!')
})


//listen
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})