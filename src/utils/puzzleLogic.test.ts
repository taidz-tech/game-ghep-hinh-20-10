import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPieces,
  shufflePieces,
  checkPlacement,
  isPuzzleSolved,
  calculateProgress
} from './puzzleLogic.ts';

test('createPieces produces exact grid pieces with correct row/col coordinates', () => {
  const pieces9 = createPieces(3, 3);
  assert.equal(pieces9.length, 9);
  assert.equal(pieces9[0].id, 1);
  assert.equal(pieces9[0].row, 0);
  assert.equal(pieces9[0].col, 0);
  assert.equal(pieces9[8].id, 9);
  assert.equal(pieces9[8].row, 2);
  assert.equal(pieces9[8].col, 2);

  const pieces12 = createPieces(3, 4);
  assert.equal(pieces12.length, 12);
  assert.equal(pieces12[11].id, 12);
  assert.equal(pieces12[11].row, 2);
  assert.equal(pieces12[11].col, 3);
});

test('checkPlacement strictly validates correct piece against correct slot', () => {
  assert.equal(checkPlacement(1, 1), true);
  assert.equal(checkPlacement(5, 5), true);
  assert.equal(checkPlacement(1, 2), false);
  assert.equal(checkPlacement(9, 4), false);
});

test('shufflePieces reorganizes elements without losing any piece', () => {
  const pieces = createPieces(3, 3);
  const shuffled = shufflePieces(pieces);
  assert.equal(shuffled.length, 9);
  const ids = shuffled.map(p => p.id).sort((a, b) => a - b);
  assert.deepEqual(ids, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('isPuzzleSolved accurately detects victory condition', () => {
  const partialMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
  };
  assert.equal(isPuzzleSolved(partialMap, 9), false);

  const fullSolvedMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9
  };
  assert.equal(isPuzzleSolved(fullSolvedMap, 9), true);

  const wrongMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 5, 7: 7, 8: 8, 9: 9
  };
  assert.equal(isPuzzleSolved(wrongMap, 9), false);
});

test('calculateProgress returns correct percentage', () => {
  assert.equal(calculateProgress(0, 9), 0);
  assert.equal(calculateProgress(3, 9), 33);
  assert.equal(calculateProgress(9, 9), 100);
  assert.equal(calculateProgress(6, 12), 50);
});
