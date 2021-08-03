import { render } from '@testing-library/react';
import Button from './Button';

test('should render button tag with children', () => {
    const component = render(<Button onClick={() => { console.log('here') }}>ABC</Button>);
    const child = component.getByTestId('button');
    
    expect(child.textContent).toBe('ABC');
    expect(child.getAttribute('type')).toBe('button');
    expect(child.getAttribute('class')).toBe('invisible ');
});
