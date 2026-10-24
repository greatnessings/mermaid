import test from 'node:test';
import assert from 'node:assert/strict';
import journeyDb, { getJourneySummary } from '../src/diagrams/user-journey/journeyDb.js';

test('getJourneySummary aggregates sections, tasks, deduplicated actors, and mean score', () => {
  journeyDb.clear();
  journeyDb.setTitle('Onboarding Journey');
  journeyDb.addSection('Signup');
  journeyDb.addTask('Create account', ':5: Alice, Bob');
  journeyDb.addTask('Verify email', ':3: Alice, Charlie');
  const summary = getJourneySummary();
  assert.equal(summary.title, 'Onboarding Journey');
  assert.equal(summary.sectionCount, 1);
  assert.equal(summary.taskCount, 2);
  assert.equal(summary.actorCount, 3);
  assert.equal(summary.meanScore, 4);
});
