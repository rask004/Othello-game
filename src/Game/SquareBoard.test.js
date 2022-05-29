import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { unmountComponentAtNode } from "react-dom";
import SquareBoard from './SquareBoard';
import {SquareBoardSpace, InteractiveSquareBoardSpace} from './SquareBoard';
import Constants from './Constants';

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

test('renders empty space', () => {
  render(<SquareBoardSpace />);
  const spaceElement = screen.getByLabelText('square space');
  expect(spaceElement).toBeInTheDocument();
});

test('renders space with counter', () => {
  const counter = {shape:'round', color:'white'};
  render(<SquareBoardSpace counter={counter} />);
  const spaceElement = screen.getByLabelText('square space');
  expect(spaceElement).toBeInTheDocument();
  const counterElement = screen.getByLabelText('game counter round white');
  expect(counterElement).toBeInTheDocument();
});

test('renders interactive empty space', () => {
  const mockCallback = jest.fn();
  render(<InteractiveSquareBoardSpace callback={mockCallback} />);
  const spaceElement = screen.getByLabelText('square space interactive');
  expect(spaceElement).toBeInTheDocument();
});

test('renders interactive space with counter', () => {
  const mockCallback = jest.fn();
  const counter = {shape:'square', color:'blue'};
  render(<InteractiveSquareBoardSpace counter={counter} callback={mockCallback} />);
  const spaceElement = screen.getByLabelText('square space interactive');
  expect(spaceElement).toBeInTheDocument();
  const counterElement = screen.getByLabelText('game counter square blue');
  expect(counterElement).toBeInTheDocument();
});

test('interactive empty space, click event response, general', async () => {
  const mockCallback = jest.fn(() => { return true });
  render(<InteractiveSquareBoardSpace callback={mockCallback} />);
  const spaceElement = screen.getByLabelText('square space interactive');
  fireEvent.click(spaceElement);
  await waitFor(() => expect(mockCallback).toHaveBeenCalledTimes(1));
  expect(mockCallback.mock.results[0].value).toBeTruthy();
});

test('Square Board, Empty', () => {
  const board = [
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace]
  ];
  const shape = 'square';
  const callback = jest.fn();
  render(<SquareBoard board={board} counterType={shape} spaceCallback={callback} />);
  const boardElement = screen.getByLabelText('game board');
  expect(boardElement).toBeInTheDocument();
  expect(boardElement.childElementCount).toBe(4);
  for(const row of boardElement.children) {
    expect(row.childElementCount).toBe(4);
  }
  const spaceElements = screen.queryAllByLabelText('square space');
  expect(spaceElements.length).toBe(16);
  const spaceElementsInteractive = screen.queryAllByLabelText('square space interactive');
  expect(spaceElementsInteractive.length).toBe(0);

});

test('Square Board, Othello Setup', () => {
  const board = [
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace],
    [Constants.emptySpace, {color:'white'},{color:'black'},Constants.emptySpace],
    [Constants.emptySpace, {color:'black'},{color:'white'},Constants.emptySpace],
    [Constants.emptySpace, Constants.emptySpace,Constants.emptySpace,Constants.emptySpace]
  ];
  const shape = 'round';
  const callback = jest.fn();
  const moves = [{x:0,y:1}, {x:1,y:0}, {x:2,y:3}, {x:3,y:2}]
  render(<SquareBoard board={board} counterType={shape} validMoves={moves} spaceCallback={callback} />);
  const blackCounterElements = screen.queryAllByLabelText('game counter round black');
  expect(blackCounterElements.length).toBe(2);
  const whiteCounterElements = screen.queryAllByLabelText('game counter round white');
  expect(whiteCounterElements.length).toBe(2);
  const spaceElements = screen.queryAllByLabelText('square space');
  expect(spaceElements.length).toBe(12);
  const spaceElementsInteractive = screen.queryAllByLabelText('square space interactive');
  expect(spaceElementsInteractive.length).toBe(4);
});
