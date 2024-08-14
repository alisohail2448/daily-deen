require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
// const fileUpload = require('express-fileupload');
const cors = require('cors');

app.use(bodyParser.json())
// app.use(fileUpload());
app.use(express.static('uploads'));
app.use(cors());

// Routes
const userRoute = require('./routes/user');
const uploadRoute = require('./routes/upload');



// Connect to db
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected..");
  })
  .catch((error) => {
    console.log("Error on db connection: ", error)
  })

app.get('/', function (req, res) {
  res.status(200).json({
    msg: "Welcome, your app is working well"
  })
})

app.use('/auth', userRoute);
app.use('/upload', uploadRoute);


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
})