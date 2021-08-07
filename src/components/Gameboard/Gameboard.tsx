import { useEffect, useState } from "react";
import TShipBlock from "../../types/ShipBLock";
import TShipDirection from "../../types/ShipDirection";
import isEmpty from "../../utils/isEmpty";
import Block from "../Block/Block";
import styles from './Gameboard.module.scss';

type TGameState = Array<Array<TShipBlock>>;

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
    return (i: number) => lineID;
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
    } else if (direction === 'left') {
        return (i: number) => blockID + i;
    } return (i: number) => blockID;
}

const highlightBlock = (block: TShipBlock, direction: TShipDirection, isStartBlock: boolean, isEndBlock: boolean) => {
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
    const [gameState, setGameState] = useState<TGameState>([
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ],
        [
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
        ]
    ]);
    const [previousLineIDBlockID, setPreviousLineIDBlockID] = useState<Array<number>>([-1, -1]);
    const [currentDirection, setCurrentDirection] = useState<TShipDirection>('up')

    const onDirectionChange = (e: KeyboardEvent) => {
        const [lineID, blockID] = previousLineIDBlockID;
        // Cannot change direction if there's no highlighted block and valid key is pressed
        if (lineID !== -1 && blockID !== -1 && !isEmpty(getDirection(e.key))) {
            const _gameState = [...gameState];
            const currentBlock = _gameState[lineID][blockID];
            // Cannot highlight already active block
            if (!currentBlock.on) {
                const currentShipLength = 4;
                const previousShipLength = 4;
                const direction: TShipDirection = getDirection(e.key);

                //#region Reseting existing hightlighted blocks
                const lineIDResetFunc = getNextLineID(currentDirection, lineID);
                const blockIDresetFunc = getNextBlockID(currentDirection, blockID);

                for (let i = 0; i < previousShipLength; i++) {
                    const nextBlockID = blockIDresetFunc(i);
                    const nextLineID = lineIDResetFunc(i);
                    _gameState[nextLineID][nextBlockID] = resetBlock(_gameState[nextLineID][nextBlockID]);
                }
                //#endregion

                //#region Highlighting new blocks with new direction
                const lineIDHighlightFunc = getNextLineID(direction, lineID);
                const blockIDHighlightFunc = getNextBlockID(direction, blockID);

                for (let i = 0; i < currentShipLength; i++) {
                    const nextBlockID = blockIDHighlightFunc(i);
                    const nextLineID = lineIDHighlightFunc(i);
                    _gameState[nextLineID][nextBlockID] = highlightBlock(_gameState[nextLineID][nextBlockID], direction, i === 0, i === currentShipLength - 1);
                }
                //#endregion

                setGameState([..._gameState]);
                setCurrentDirection(direction);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onDirectionChange)
        return () => {
            document.removeEventListener('keydown', onDirectionChange);
        }
    }, [onDirectionChange]);

    const onBlockHover = (blockID: number, lineID: number) => {
        const _gameState = [...gameState];
        const currentBlock = _gameState[lineID][blockID];
        if (!currentBlock.on) {
            const currentShipLength = 4;
            const previousShipLength = 4;

            const [pLineID, pBlockID] = previousLineIDBlockID;

            if (pLineID !== -1 && pBlockID !== -1) {
                for (let i = 0; i < previousShipLength; i++) {
                    _gameState[pLineID + i][pBlockID] = resetBlock(_gameState[pLineID + i][pBlockID]);
                }
            }

            for (let i = 0; i < currentShipLength; i++) {
                _gameState[lineID + i][blockID].highlight = true;
                _gameState[lineID + i][blockID].start = i === 0;
                _gameState[lineID + i][blockID].end = i === currentShipLength - 1;
                _gameState[lineID + i][blockID].direction = "up";
            }

            setGameState([..._gameState]);
            setPreviousLineIDBlockID([lineID, blockID]);
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
