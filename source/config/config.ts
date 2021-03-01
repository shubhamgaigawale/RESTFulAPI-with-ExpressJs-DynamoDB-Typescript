import * as dotenv from 'dotenv';

dotenv.config();

const REGION = process.env.REGION
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY
const ENDPOINT = process.env.ENDPOINT

const AWS = {
    region: REGION,
    accessKeyId : ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    endpoint:ENDPOINT
}

const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER = {
    port: SERVER_PORT
};

const config = {
    server: SERVER,
    aws:AWS
};

export default config;