const express = require('express');
const app = express();
const ingestRoutes = require('./routes/ingest');
const { startWorker } = require('./services/worker');

app.use(express.json());
app.use('/', ingestRoutes);

startWorker(); // Start processing loop

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
