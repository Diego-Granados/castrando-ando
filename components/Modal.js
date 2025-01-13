import React from 'react';
import styles from './styles/Modal.module.css';

const Modal = ({ title, children, onClose }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;