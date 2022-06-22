import assert, { fail } from 'node:assert';
import {getValidMoves, validateGameEnd, updateCaptures, decomposeToSequences} from './Othello';
import Constants from '../Constants.js';

const players = [{name: "A", color:"red"}, {name: "B", color:"blue"}];
let board;

beforeEach(() => {
  board = [
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,players[0], players[1], Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,players[1], players[0], Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace,Constants.emptySpace]
  ];
});

test('UpdaterCaptures makes correct capture updates', () => {
  fail();

  let testMove, testPlayer

  testMove = {player: 1, y: 3, x: 2};
  testPlayer = players[testMove.player]
  board[testMove.y][testMove.x] = testPlayer
  const firstTestBoard = updateCaptures(board, testPlayer)
  assert(firstTestBoard[3][3] === testPlayer, "Fail: position 3,3 should be captured by player B")

  board[3][3] = players[1]
  board[3][5] = players[1]
  board[2][4] = players[0]

  testMove = {player: 0, y: 4, x: 2};
  testPlayer = players[testMove.player]
  board[testMove.y][testMove.x] = testPlayer
  const secondTestBoard = updateCaptures(board, testPlayer)
  assert(firstTestBoard[3][3] === testPlayer, "Fail: position 3,3 should be captured by player A")
  assert(firstTestBoard[4][3] === testPlayer, "Fail: position 4,3 should be captured by player A")
});

test('ValidatorGameEnd correctly determines a game has ended', () => {
  fail();
});

test('ValidatorMoves correctly identifies valid moves', () => {
  fail();
  const firstTest = [{player:0, validMoves:[{x:3,y:5},{x:5,y:3},{x:4,y:2},{x:2,y:4}]}, {player:1, validMoves:[{x:2,y:3},{x:3,y:2},{x:5,y:4},{x:4,y:5}]}]
  const firstTestMovesPlayerA = getValidMoves(board, players[0])
  const firstTestMovesPlayerB = getValidMoves(board, players[1])
  //TODO: for each list of moves, for each move, assert the move is present in the relevant player's validMoves.

});
