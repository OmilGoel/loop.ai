const request = require('supertest');
const app = require('../server');

describe('Ingestion API', () => {
  it('should ingest and return an ID', async () => {
    const res = await request(app)
      .post('/ingest')
      .send({ ids: [1, 2, 3], priority: 'HIGH' });
    expect(res.statusCode).toBe(200);
    expect(res.body.ingestion_id).toBeDefined();
  });
});
