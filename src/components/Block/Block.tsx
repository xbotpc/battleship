import cx from 'classnames';
import { MouseEvent } from 'react';
import styles from './Block.module.scss';

type BlockProps = {
    isActive: boolean;
    isHighlighted: boolean;
    direction: '' | 'up' | 'down' | 'left' | 'right';
    start: boolean;
    end: boolean;
    hit: boolean;
    onHover: (e: MouseEvent<HTMLDivElement>) => void;
}

const Block = ({ isActive, isHighlighted, start, end, direction, hit, onHover }: BlockProps): JSX.Element => {
    return (
        <div className={cx(styles.block, {
            [styles.highlight]: isHighlighted
        })}
            onMouseEnter={onHover}>
            {isActive || isHighlighted ? (
                <div className={cx(
                    styles.ship,
                    {
                        [styles.isActive]: isActive,
                        [styles.isHighlighted]: isHighlighted,
                        [styles.start]: start,
                        [styles.end]: end,
                        [styles[`${direction}`]]: true,
                        [styles.blockPiece]: !start && !end
                    })}
                >
                    {isActive || isHighlighted ?
                        <div className={cx(styles.piece, {
                            [styles.hit]: hit
                        })} />
                        : null}
                </div>
            ) : null}
        </div >
    )
}

export default Block
