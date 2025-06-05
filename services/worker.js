const { jobQueue, statuses } = require('../store/memory'); 
function startWorker() {
  async function processNext() {
    if (jobQueue.length === 0) {
      // Retry after 1s if queue is empty
      return setTimeout(processNext, 1000);
    }

    // Sort: by priority and createdTime
    jobQueue.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.createdTime - b.createdTime;
    });

    const batch = jobQueue.shift();
    statuses[batch.batchId] = 'triggered';

    // Process each ID with simulated delay
    for (const id of batch.ids) {
      await new Promise(res => setTimeout(res, 1000)); // Simulate 1s processing
      console.log(`Processed ID: ${id}`);
    }

    statuses[batch.batchId] = 'completed';
    console.log(`Batch ${batch.batchId} completed.`);

    // Enforce 5s rate limit between batches
    setTimeout(processNext, 5000);
  }

  processNext(); // Start processing loop
}

module.exports = { startWorker };

