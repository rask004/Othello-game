import { render, screen } from '@testing-library/react';
import assert from 'node:assert';
import { unmountComponentAtNode } from "react-dom";
import Counter from './Counter';

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

test('renders Counter Round White', () => {
  const color = 'white';
  const shape = 'round';
  render(<Counter color={color} shape={shape} />);
  const counterElement = screen.getByLabelText('game counter round white');
  expect(counterElement).toBeInTheDocument();
  assert.equal(counterElement instanceof HTMLDivElement, true);
});

test('renders Counter Round Black', () => {
  const color = 'black';
  const shape = 'round';
  render(<Counter color={color} shape={shape} />);
  const counterElement = screen.getByLabelText('game counter round black');
  expect(counterElement).toBeInTheDocument();
  assert.equal(counterElement instanceof HTMLDivElement, true);
});

test('renders Counter Square White', () => {
  const color = 'white';
  const shape = 'square';
  render(<Counter color={color} shape={shape} />);
  const counterElement = screen.getByLabelText('game counter square white');
  expect(counterElement).toBeInTheDocument();
  assert.equal(counterElement instanceof HTMLDivElement, true);
});

test('renders Counter Square Black', () => {
  const color = 'black';
  const shape = 'square';
  render(<Counter color={color} shape={shape} />);
  const counterElement = screen.getByLabelText('game counter square black');
  expect(counterElement).toBeInTheDocument();
  assert.equal(counterElement instanceof HTMLDivElement, true);
});
