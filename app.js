require('dotenv').config()
const router = require('./routes/router')
const connectDB = require('./db/connect');

const express = require('express')
const app = express();

app.use(express.json())

app.use('/api/v1',router);

const start = async () => {
    try {
      await connectDB(process.env.MONGOURI);
      app.listen(5000, () => console.log(`app is listening on port 5000...`));
    } catch (error) {
      console.log(error);
    }
  };
  start();