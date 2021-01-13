import express from 'express'

import path from 'path'
const app = express()
const port = process.env.PORT || 8000

app.get('/', (req, res) => res.send('Trackspace API'))

// Serve static files from the React app.
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
  console.log(`⚡️ Server is running at https://localhost:${port}`)
})