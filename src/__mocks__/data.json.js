// Manual mock for src/data/data.json used in tests
module.exports = {
  id: 'seed-map',
  name: 'seed',
  venueId: 1,
  venueName: 'test',
  blockId: 1,
  blockName: 'general',
  stageText: 'STAGE',
  seatMapData: [
    { id: 's1', row: 'A', label: '1', type: 'seat' },
    { id: 's2', row: 'A', label: '2', type: 'seat' },
    { id: 's3', row: 'B', label: '1', type: 'seat' },
  ],
};
