import { ReactNode } from "react";
import { createPortal } from "react-dom";
import './Modal.scss';

interface ModalProps {
    id: string,
    type?: 'hidden' | 'fullscreen',
    children: ReactNode,
    styleClass?: string,
}

const Modal = ({ id, children, type = 'hidden', styleClass = '' }: ModalProps) => {

    const node = (
        <>
            <div className={styleClass} data-testid={`${id}-testid`}>
                {children}
            </div>
        </>
    );

    if (document.querySelector(`body>div#${id}`) === null) {
        const modalElement = document.createElement('div');
        modalElement.setAttribute('id', id);
        document.querySelector('body')?.appendChild(modalElement);
    }
    document.querySelector(`body>div#${id}`)?.setAttribute('class', type);


    return createPortal(node, document.getElementById(id)!)
}

export default Modal
