import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();

import todoRoutes from './routes/todo';

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.json({
        message:'Hello World'
    })
})

app.use('/api/', todoRoutes);

const port = config.server

app.listen(port , () => {
    console.log(`Application is running at port ${port}`);
})