const connectToMongo=require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express()
const port = 5000


//Availabe routes
app.use(cors())
app.use(express.json()) //to use request.body we need this middleware
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// http://localhost:3000/  this is our local host url ispe click krke server pe get request maari and then we get response 'hello world' This express app starts a server and listens on port 3000 for connections. The app responds with “Hello World!” for requests to the root URL (/) or route. For every other path, it will respond with a 404 Not Found.

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})