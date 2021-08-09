import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import Gameboard from '../../components/Gameboard/Gameboard';
import store from '../../state/store';
import TShipBlock from '../../types/ShipBLock';
import TShipDirection from '../../types/ShipDirection';
import isEmpty from '../../utils/isEmpty';
import './App.module.scss';

let socket;

type TGameState = Array<Array<TShipBlock>>;
type TBlockUpdaterFunction = (block: TShipBlock, direction?: TShipDirection, isStart?: boolean, isEnd?: boolean) => TShipBlock
type TupdateBoard = {
  _gameState: TGameState,
  direction: TShipDirection,
  lineID: number,
  blockID: number,
  shipLength: number,
  blockUpdater: TBlockUpdaterFunction
}

const getDirection = (key: string) => {
  if (key === 'w' || key === 'ArrowUp') {
    return 'up';
  }
  if (key === 'a' || key === 'ArrowLeft') {
    return 'left';
  }
  if (key === 'd' || key === 'ArrowRight') {
    return 'right';
  }
  if (key === 's' || key === 'ArrowDown') {
    return 'down';
  } return '';
}

/**
* Gets the function for changing the line ID instead of checking for direction in a loop
* @param direction Direction of ship
* @param lineID current line ID
* @returns Function with action of line ID. Wether it will increment or decrement
*/
const getNextLineID = (direction: TShipDirection, lineID: number) => {
  if (direction === 'up') {
    return (i: number) => lineID + i;
  }
  if (direction === 'down') {
    return (i: number) => lineID - i;
  }
  return (i?: number) => lineID;
}

/**
* Gets the function for changing the block ID instead of checking for direction in a loop
* @param direction Direction of ship
* @param lineID current block ID
* @returns Function with action of block ID. Wether it will increment or decrement
*/
const getNextBlockID = (direction: TShipDirection, blockID: number) => {
  if (direction === 'right') {
    return (i: number) => blockID - i;
  }
  if (direction === 'left') {
    return (i: number) => blockID + i;
  }
  return (i?: number) => blockID;
}

const highlightBlock = (block: TShipBlock, direction: TShipDirection = '', isStartBlock = false, isEndBlock = false) => {
  block.on = false;
  block.highlight = true;
  block.start = isStartBlock;
  block.end = isEndBlock;
  block.direction = direction;
  return block;
}

const resetBlock = (block: TShipBlock): TShipBlock => {
  return {
    ...block,
    highlight: false
  };
}

function App(): JSX.Element {

  const [yourFleet, setYourFleet] = useState<TGameState>([[
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ]]);
  const [enemyFleet, setEnemyFleet] = useState<TGameState>([[
    { on: false, direction: "", start: false, end: false, hit: true, highlight: false, miss: true, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ], [
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false },
    { on: false, direction: "", start: false, end: false, hit: false, highlight: false, miss: false, mark: false }
  ]])
  const [previousLineIDBlockID, setPreviousLineIDBlockID] = useState<Array<number>>([-1, -1]);
  const [currentDirection, setCurrentDirection] = useState<TShipDirection>('up');

  const isOutOfBounds = (_gameState: TGameState, direction: TShipDirection, shipLength: number, lineID: number, blockID: number) => {
    const outOfBoundsLineIDFunc = getNextLineID(direction, lineID);
    const outOfBoundsBlockIDFunc = getNextBlockID(direction, blockID);
    let notOutOfBounds = true;

    for (let i = 0; i < shipLength; i++) {
      const lineID = outOfBoundsLineIDFunc(i);
      const blockID = outOfBoundsBlockIDFunc(i);
      if (!((lineID >= 0 && lineID <= 9) &&
        (blockID >= 0 && blockID <= 9))) {
        notOutOfBounds = false;
        break;
      }
      if (_gameState[lineID][blockID]?.on) {
        notOutOfBounds = false;
        break;
      }
    }
    return notOutOfBounds;
  }

  const updateBoard = ({ _gameState, direction, lineID, blockID, shipLength, blockUpdater }: TupdateBoard) => {
    const lineIDHighlightFunc = getNextLineID(direction, lineID);
    const blockIDHighlightFunc = getNextBlockID(direction, blockID);

    for (let i = 0; i < shipLength; i++) {
      const nextBlockID = blockIDHighlightFunc(i);
      const nextLineID = lineIDHighlightFunc(i);
      _gameState[nextLineID][nextBlockID] = blockUpdater(_gameState[nextLineID][nextBlockID], direction, i === 0, i === shipLength - 1);
    }
    return _gameState;
  }

  //Bug: multi-key press causes weird _gameState changes
  const onDirectionChange = (e: KeyboardEvent) => {
    // Previous LineID and BlockID here is considered as current line and block ID
    const [cLineID, cBlockID] = previousLineIDBlockID;
    // Cannot change direction if there's no highlighted block and valid key is pressed
    if (cLineID !== -1 && cBlockID !== -1 && !isEmpty(getDirection(e.key))) {
      let _gameState = [...yourFleet];
      const currentBlock = _gameState[cLineID][cBlockID];
      // Cannot highlight already active block
      if (!currentBlock.on) {
        const currentShipLength = 4;
        const previousShipLength = 4;
        const direction: TShipDirection = getDirection(e.key);

        //#region Checking for out of bounds future line and block ID
        const isNotOutOfBounds = isOutOfBounds(_gameState, direction, currentShipLength, cLineID, cBlockID);
        //#endregion

        if (isNotOutOfBounds) {
          //#region Reseting existing hightlighted blocks
          console.log('reset', e.key)
          _gameState = updateBoard({
            _gameState,
            direction: currentDirection,
            lineID: cLineID,
            blockID: cBlockID,
            shipLength: previousShipLength,
            blockUpdater: resetBlock
          });
          //#endregion

          //#region Highlighting new blocks with new direction
          console.log('highlight', e.key, _gameState);
          _gameState = updateBoard({
            _gameState, direction,
            lineID: cLineID,
            blockID: cBlockID,
            shipLength: currentShipLength,
            blockUpdater: highlightBlock
          });
          //#endregion

          setYourFleet([..._gameState]);
          setCurrentDirection(direction);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onDirectionChange)
    return () => {
      document.removeEventListener('keydown', onDirectionChange);
    }
  }, [onDirectionChange]);

  //TODO: Blocks are not highlighted if hover position is valid 
  //      but end position is not within box limits 
  //BUG: Re-entered hover after clicking on opponent's tile causes multiple ship highlights
  const onBlockHover = (type: string, lineID: number, blockID: number) => {
    let _gameState: TGameState = [];
    let fleetUpdateFunction = setYourFleet;
    if (type === "enemy") {
      _gameState = [...enemyFleet];
      fleetUpdateFunction = setEnemyFleet;
    } else if (type === 'self') {
      _gameState = [...yourFleet];
      fleetUpdateFunction = setYourFleet;
    }

    const currentBlock = _gameState[lineID][blockID];
    if (!currentBlock.on) {
      const currentShipLength = type === "enemy" ? 1 : 4;
      const previousShipLength = type === "enemy" ? 1 : 4;

      const isNotOutOfBounds = isOutOfBounds(_gameState, currentDirection, currentShipLength, lineID, blockID);


      if (isNotOutOfBounds) {
        const [pLineID, pBlockID] = previousLineIDBlockID;

        if (pLineID !== -1 && pBlockID !== -1) {
          _gameState = updateBoard({
            _gameState,
            direction: currentDirection,
            lineID: pLineID,
            blockID: pBlockID,
            shipLength: previousShipLength,
            blockUpdater: resetBlock
          })
        }

        _gameState = updateBoard({
          _gameState,
          direction: currentDirection,
          lineID,
          blockID,
          shipLength: currentShipLength,
          blockUpdater: highlightBlock
        });

        fleetUpdateFunction([..._gameState]);
        setPreviousLineIDBlockID([lineID, blockID]);
      }

    }
  }

  // TODO: Check for outofBounds and shiplength issue
  const onBlockClick = (type: string, lineID: number, blockID: number) => {
    let _gameState: TGameState = [];
    let fleetUpdateFunction = setYourFleet;
    if (type === "enemy") {
      _gameState = [...enemyFleet];
      fleetUpdateFunction = setEnemyFleet;
    } else if (type === 'self') {
      _gameState = [...yourFleet];
      fleetUpdateFunction = setYourFleet;
    }

    const switchOn: TBlockUpdaterFunction = (aa: TShipBlock) => {
      return {
        ...aa,
        on: true,
        highlight: false,
        hit: false,
      };
    }

    const currentShipLength = type === "enemy" ? 1 : 4;

    _gameState = updateBoard({
      _gameState,
      direction: currentDirection,
      lineID,
      blockID,
      blockUpdater: switchOn,
      shipLength: currentShipLength
    });

    fleetUpdateFunction([..._gameState]);
  }

  useEffect(() => {
    socket = io('http://localhost:8080');
    socket.on('post-connection', (data) => {
      console.log('Connected on client side', data);
    })
  }, []);

  return (
    <Provider store={store}>
      <main>
        <section>
          <Gameboard
            type={'self'}
            name={"Your fleet"}
            gameState={yourFleet}
            onBlockClick={onBlockClick}
            onBlockHover={onBlockHover}
          />
        </section>
        <section>
          <Gameboard
            type={'enemy'}
            name={"Enemy's fleet"}
            gameState={enemyFleet}
            onBlockClick={onBlockClick}
            onBlockHover={onBlockHover}
          />
        </section>
      </main>
    </Provider>
  );
}

export default App;
