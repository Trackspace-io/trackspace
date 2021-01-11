import express from 'express'

const app = express()
const port = process.env.PORT || 8000

app.get('/', (req, res) => res.send('Trackspace API'))

app.listen(port, () => {
  console.log(`⚡️ Server is running at https://localhost:${port}`)
})
