import * as React from 'react';
import { default as ReactModal } from 'react-modal';

import style from '../../styles/gui/Modal.module.css';

/**
 * Component representing a modal.
 *
 * @param {{
 *  isOpen: boolean,
 *  onClose: () => void
 * }}} props The props of the component
 */

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<IModalProps> = ({ children, isOpen, onClose }) => {
  return (
    <ReactModal className={style['modal']} isOpen={isOpen} onRequestClose={onClose}>
      {children}
    </ReactModal>
  );
};

export default Modal;
