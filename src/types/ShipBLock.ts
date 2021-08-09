import TShipDirection from "./ShipDirection";

type TShipBlock = {
    on: boolean;
    direction: TShipDirection;
    start: boolean;
    end: boolean;
    hit: boolean;
    mark: boolean;
    miss: boolean;
    highlight: boolean;
}

export default TShipBlock;