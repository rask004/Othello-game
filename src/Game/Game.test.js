import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { fail } from 'node:assert';
import { unmountComponentAtNode } from "react-dom";
import Game from './Game';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const width = 8;
const height = 8;

jest.mock("./Othello", () => {
  const MockValidatorMoves = {
    getValidMoves: (board, player) => {
      let validMoves = [];
      for (const j in board) {
        const row = board[j];
        for (const i in row) {
          validMoves.push({x:i, y:j});
        }
      }
      return validMoves;
    }
  }
  const MockValidatorGameEnd = {
    isFinished: (board) => {
        return false;
    }
  }
  const MockUpdaterCaptures = {
    update: (board, location) => {
        return board;
    },
  }
  return {
    ValidatorMoves: MockValidatorMoves, 
    ValidatorGameEnd: MockValidatorGameEnd, 
    UpdaterCaptures: MockUpdaterCaptures
  }
});


test('game renders board', () => {
  render(<Game boardwidth={width} boardHeight={height} />);
  const boardElement = screen.getByLabelText('game board');
  expect(boardElement).toBeInTheDocument();
  const blackCounterElements = screen.queryAllByLabelText('game counter round black');
  expect(blackCounterElements.length).toBe(2);
  const whiteCounterElements = screen.queryAllByLabelText('game counter round white');
  expect(whiteCounterElements.length).toBe(2);
  const spaceElements = screen.queryAllByLabelText('square space');
  expect(spaceElements.length).toBe(60);
  const spaceElementsInteractive = screen.queryAllByLabelText('square space interactive');
  expect(spaceElementsInteractive.length).toBe(4);
});

test('game, perform moves', () => {
  render(<Game boardwidth={width} boardHeight={height} />);
  let blackCounterElements = screen.queryAllByLabelText('game counter round black');
  expect(blackCounterElements.length).toBe(2);
  let whiteCounterElements = screen.queryAllByLabelText('game counter round white');
  expect(whiteCounterElements.length).toBe(2);
  let space = screen.getByTestId('board-space-3-2');
  fireEvent.click(space);
  blackCounterElements = screen.queryAllByLabelText('game counter round black');
  expect(blackCounterElements.length).toBe(3);
  space = screen.getByTestId('board-space-5-3');
  fireEvent.click(space);
  whiteCounterElements = screen.queryAllByLabelText('game counter round white');
  expect(whiteCounterElements.length).toBe(3);
  fail();
});

