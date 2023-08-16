const express = require('express');
const dotenv = require('dotenv');
const db = require('./Connect/mongoose');
const routes = require('./Routes/routes')
const app = express();
app.use(express.json());
dotenv.config();

//db connection
db()

app.get('/', (req, res) => {
    res.send('Hello World')
})
const portal = process.env.portal || 8000

app.use(routes)

app.listen(portal, () => {
    console.log(`App is running on a Portal ${portal}`)
})

