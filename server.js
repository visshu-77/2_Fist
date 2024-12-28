const http = require("http");
const app = require("./app");
const port = process.env.port || 3002;
const server = http.createServer(app);
const mongoose = require("mongoose");
require('dotenv').config()

const url = process.env.url;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//connect to server 	
app.listen(port,(err)=>
{
	if(err){
		console.log(err)
	}
	else{
		console.log(`the server is running on port number ${process.env.port}`)
	}
});
