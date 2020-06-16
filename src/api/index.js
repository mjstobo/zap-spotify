import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGOOSE_DB, {useNewUrlParser: true});

const api = express()
const port = process.env.PORT

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');
});

api.get('/', (req, res) => res.send({
    message: 'Hello from the API',
  })
)

export default api;
