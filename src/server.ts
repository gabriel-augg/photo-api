import express from "express"
import dotenv from "dotenv"
import db from "./config/db"

dotenv.config()

const port = process.env.PORT!
const app = express()

app.use(express.json())

app.listen(port, async () => {
    console.log('Server running on port 3000');
    await db();
})

