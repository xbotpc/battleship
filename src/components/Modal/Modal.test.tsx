import { render } from '@testing-library/react';
import { MouseEvent } from 'react';
import Button from '../Button/Button';
import Modal from './Modal';

const modalID = 'hiddenModal';
const testID = `${modalID}-testid`

describe('Single Modal with text', () => {
    let _containerElement: HTMLElement;

    beforeEach(() => {
        const { getByTestId } = render(<Modal id={modalID}>ABC</Modal>);
        _containerElement = getByTestId(testID);
        expect(_containerElement.getAttribute('class')).toBe('');
        expect(_containerElement?.parentElement?.getAttribute('id')).toBe('hiddenModal');
        expect(_containerElement?.parentElement?.parentElement?.tagName).toBe('BODY');
    })

    test('should render text', () => {
        expect(_containerElement.textContent).toBe('ABC');
    });
});

describe('Single Modal containing other components', () => {
    let _containerElement: HTMLElement;
    const onClick = (e: MouseEvent<HTMLButtonElement>) => {

    };

    beforeEach(() => {
        const { getByTestId } = render(<Modal id={modalID}>
            <Button onClick={onClick}>
                ABC
            </Button>
        </Modal>);
        _containerElement = getByTestId(testID);
        expect(_containerElement.getAttribute('class')).toBe('');
        expect(_containerElement?.parentElement?.getAttribute('id')).toBe('hiddenModal');
        expect(_containerElement?.parentElement?.parentElement?.tagName).toBe('BODY');
    })

    test('should render button', () => {
        expect(_containerElement.hasChildNodes()).toBe(true);
        expect(_containerElement.getElementsByTagName('button')[0].tagName).toBe('BUTTON')
        expect(_containerElement.childNodes[0].textContent).toBe('ABC');
    });

    test('should render button with text', () => {
        expect(_containerElement.getElementsByTagName('button')[0].textContent).toBe('ABC');
    });

    // test('should render button with onClick functionality', () => {
    //     const buttonElement = _containerElement.getElementsByTagName('button')[0];
    //     fireEvent(buttonElement)
    //     expect(onClick).toHaveBeenCalled();
    // });
});
