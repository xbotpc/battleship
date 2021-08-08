import { useEffect, useState } from "react";
import TShipBlock from "../../types/ShipBLock";
import TShipDirection from "../../types/ShipDirection";
import isEmpty from "../../utils/isEmpty";
import Block from "../Block/Block";
import styles from './Gameboard.module.scss';

type TGameState = Array<Array<TShipBlock>>;
type TBlockUpdaterFunction = (block: TShipBlock, direction?: TShipDirection, isStart?: boolean, isEnd?: boolean) => TShipBlock

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

const resetBlock = (block: TShipBlock) => {
    block.on = false;
    block.hit = false;
    block.highlight = false;
    block.start = false;
    block.end = false;
    block.direction = '';
    return block;
}

const Gameboard = ({ name = '' }: { name?: string }): JSX.Element => {
    const [gameState, setGameState] = useState<TGameState>([[
        { on: true, direction: "left", start: true, end: false, hit: true, highlight: false },
        { on: true, direction: "left", start: false, end: false, hit: false, highlight: false },
        { on: true, direction: "left", start: false, end: false, hit: false, highlight: false },
        { on: true, direction: "left", start: false, end: true, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ], [
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false },
        { on: false, direction: "", start: false, end: false, hit: false, highlight: false }
    ]]);
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

    const updateBoard = (_gameState: TGameState, direction: TShipDirection, lineID: number, blockID: number, shipLength: number, blockUpdater: TBlockUpdaterFunction) => {
        const lineIDHighlightFunc = getNextLineID(direction, lineID);
        const blockIDHighlightFunc = getNextBlockID(direction, blockID);

        for (let i = 0; i < shipLength; i++) {
            const nextBlockID = blockIDHighlightFunc(i);
            const nextLineID = lineIDHighlightFunc(i);
            _gameState[nextLineID][nextBlockID] = blockUpdater(_gameState[nextLineID][nextBlockID], direction, i === 0, i === shipLength - 1);
        }
        return _gameState;
    }

    const onDirectionChange = (e: KeyboardEvent) => {
        // Previous LineID and BlockID here is considered as current line and block ID
        const [cLineID, cBlockID] = previousLineIDBlockID;
        // Cannot change direction if there's no highlighted block and valid key is pressed
        if (cLineID !== -1 && cBlockID !== -1 && !isEmpty(getDirection(e.key))) {
            let _gameState = [...gameState];
            const currentBlock = _gameState[cLineID][cBlockID];
            // Cannot highlight already active block
            if (!currentBlock.on) {
                const currentShipLength = 4;
                const previousShipLength = 4;
                const direction: TShipDirection = getDirection(e.key);

                //#region Checking for out of bounds future line and block ID
                const isNotOutOfBounds = isOutOfBounds(_gameState, direction, currentShipLength, cLineID, cBlockID);
                //#endregion

                //Bug: multi-key press causes weird _gameState changes
                if (isNotOutOfBounds) {
                    //#region Reseting existing hightlighted blocks
                    console.log('reset', e.key)
                    _gameState = updateBoard(_gameState, currentDirection, cLineID, cBlockID, previousShipLength, resetBlock);
                    //#endregion

                    //#region Highlighting new blocks with new direction
                    console.log('highlight', e.key, _gameState);
                    _gameState = updateBoard(_gameState, direction, cLineID, cBlockID, currentShipLength, highlightBlock);
                    //#endregion

                    setGameState([..._gameState]);
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

    const onBlockHover = (blockID: number, lineID: number) => {
        let _gameState = [...gameState];
        const currentBlock = _gameState[lineID][blockID];
        if (!currentBlock.on) {
            const currentShipLength = 4;
            const previousShipLength = 4;

            const isNotOutOfBounds = isOutOfBounds(_gameState, currentDirection, currentShipLength, lineID, blockID);

            //TODO: Blocks are not highlighted if hover position is valid 
            //      but end position is not within box limits 
            if (isNotOutOfBounds) {
                const [pLineID, pBlockID] = previousLineIDBlockID;

                if (pLineID !== -1 && pBlockID !== -1) {
                    _gameState = updateBoard(_gameState, currentDirection, pLineID, pBlockID, previousShipLength, resetBlock)
                }

                _gameState = updateBoard(_gameState, currentDirection, lineID, blockID, currentShipLength, highlightBlock);

                setGameState([..._gameState]);
                setPreviousLineIDBlockID([lineID, blockID]);
            }

        }
    }

    const renderGameBoard = () => {
        return gameState.map((line, lineID) => {
            return (
                <div key={lineID} className={styles.line}>
                    {line.map((block, blockID) => {
                        return (
                            <Block
                                key={`${block.direction}-${lineID}-${blockID}`}
                                isActive={block.on}
                                isHighlighted={block.highlight}
                                direction={block.direction}
                                start={block.start}
                                end={block.end}
                                hit={block.hit}
                                onHover={() => onBlockHover(blockID, lineID)}
                            />
                        )
                    })}
                </div>
            )
        })
    }

    return (
        <div>
            {renderGameBoard()}
        </div>
    )
}

export default Gameboard
