import api from './src/api';
import express from 'express'

const app = express();

app.use('/api/v1', api);

app.listen(process.env.PORT);