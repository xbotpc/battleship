import TShipDirection from "./ShipDirection";

type TShipBlock = {
    on: boolean;
    direction: TShipDirection;
    start: boolean;
    end: boolean;
    hit: boolean;
    highlight: boolean;
}

export default TShipBlock;