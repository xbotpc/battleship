import cx from 'classnames';
import { memo, MouseEvent } from 'react';
import { ReactComponent as HitIcon } from '../../images/SVG/hit.svg';
import { ReactComponent as MissIcon } from '../../images/SVG/miss.svg';
import { ReactComponent as TargetIcon } from '../../images/SVG/target.svg';
import TShipDirection from '../../types/ShipDirection';
import styles from './Block.module.scss';

type BlockProps = {
    isActive: boolean;
    isHighlighted: boolean;
    direction: TShipDirection;
    start: boolean;
    end: boolean;
    hit: boolean;
    miss?: boolean;
    mark?: boolean;
    type?: 'self' | 'enemy'
    onHover: (e: MouseEvent<HTMLDivElement>) => void;
}

const Block = ({ isActive, type, miss = false, mark, isHighlighted, start, end, direction, hit, onHover }: BlockProps): JSX.Element => {
    return (
        <div className={cx(styles.block,
            type === 'enemy' ? {}
                : { [styles.highlight]: isHighlighted })}
            onMouseEnter={onHover}>
            {isActive || isHighlighted ? (
                <div className={cx(styles.ship,
                    type === 'enemy' ? {}
                        : {
                            [styles.isActive]: isActive,
                            [styles.isHighlighted]: isHighlighted,
                            [styles.start]: start,
                            [styles.end]: end,
                            [styles[`${direction}`]]: true,
                            [styles.blockPiece]: !start && !end
                        })}
                >
                    {type === 'enemy'
                        ? hit
                            ? <HitIcon fill={'red'} />
                            : miss
                                ? <MissIcon fill={'#2823d7'} />
                                : <TargetIcon fill={'red'} />
                        : isActive || isHighlighted
                            ? <div className={cx(styles.piece, { [styles.hit]: hit })} />
                            : null}
                </div>
            ) : null}
        </div >
    )
}

export default memo(Block);
