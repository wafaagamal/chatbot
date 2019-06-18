require('dotenv').config()
let express= require('express')
let app =express()
let server =require('http').createServer(app)
var io = require('socket.io')(server)

const apiai = require('apiai')(process.env.APIAI_TOKEN)

app.use(express.static(__dirname+'/views'))
app.use(express.static(__dirname+'/public'))

app.get('/', (req, res) => {
    res.render('index.html');
  });
  

  io.on('connection', function(socket) {
    socket.on('chat message', (text) => {
  
      // Get a reply from API.AI
  
      let apiaiReq = apiai.textRequest(text, {
        sessionId: APIAI_SESSION_ID
      });
  
      apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        socket.emit('bot reply', aiText); // Send the result back to the browser!
      });
  
      apiaiReq.on('error', (error) => {
        console.log(error);
      });
  
      apiaiReq.end();
  
    });
    
  });
  
 
  server.listen(5000,function(){
    console.log('server running on 5000 ..........');
    
  });