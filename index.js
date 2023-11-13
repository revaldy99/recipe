const express = require("express");
const Router = require("./src/router")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const port = 3000

const corsOptions = {
	origin : '*',
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'))

app.get('/',(req,res,next)=>{
	res.json({messsage:'success',data:'server success running on port 3000'})
})

app.use(Router)

app.listen(port,()=>{
	console.log(`app running on port ${port}`)
})