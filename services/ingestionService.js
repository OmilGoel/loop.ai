const { v4: uuidv4 } = require('uuid');
const { jobQueue, ingestions, batches, statuses } = require('../store/memory');

const priorityMap = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const handleIngest = (req, res) => {
  const { ids, priority = 'MEDIUM' } = req.body;
  const ingestionId = uuidv4();
  const createdTime = Date.now();

  ingestions[ingestionId] = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batchIds = ids.slice(i, i + 3);
    const batchId = uuidv4();
    const batch = { ingestionId, batchId, ids: batchIds };
    jobQueue.push({ priority: priorityMap[priority], createdTime, ...batch });
    ingestions[ingestionId].push(batchId);
    batches[batchId] = batch;
    statuses[batchId] = 'yet_to_start';
  }

  res.json({ ingestion_id: ingestionId });
};

const getStatus = (req, res) => {
  const { id } = req.params;
  const batchIds = ingestions[id];

  if (!batchIds) return res.status(404).json({ error: 'Not found' });

  const batchStatusList = batchIds.map((batchId) => ({
    batch_id: batchId,
    ids: batches[batchId].ids,
    status: statuses[batchId]
  }));

  let outerStatus = 'yet_to_start';
  if (batchStatusList.every(b => b.status === 'completed')) {
    outerStatus = 'completed';
  } else if (batchStatusList.some(b => b.status === 'triggered')) {
    outerStatus = 'triggered';
  }

  res.json({ ingestion_id: id, status: outerStatus, batches: batchStatusList });
};

module.exports = { handleIngest, getStatus };
