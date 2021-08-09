import TBoard from "../../types/Board";
import Block from "../Block/Block";
import Button from "../Button/Button";
import styles from './Gameboard.module.scss';

type GameboardProps = {
    name: string;
    gameState: TBoard;
    type: 'self' | 'enemy';
    onBlockHover: (type: string, lineID: number, blockID: number) => void;
    onBlockClick: (type: string, lineID: number, blockID: number) => void;
}

const Gameboard = ({ name = '', type = 'self', gameState, onBlockHover, onBlockClick }: GameboardProps): JSX.Element => {

    const renderGameBoard = () => {
        return gameState.map((line, lineID) => {
            return (
                <div key={lineID} className={styles.line}>
                    {line.map((block, blockID) => {
                        return (
                            <Button key={`${block.direction}-${lineID}-${blockID}`}
                                onClick={() => onBlockClick(type, lineID, blockID)}>
                                <Block
                                    type={type}
                                    isActive={block.on}
                                    isHighlighted={block.highlight}
                                    direction={block.direction}
                                    start={block.start}
                                    end={block.end}
                                    hit={block.hit}
                                    onHover={() => onBlockHover(type, lineID, blockID)}
                                />
                            </Button>
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
