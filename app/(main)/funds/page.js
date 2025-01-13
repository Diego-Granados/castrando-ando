"use client";

import React, { useState, useRef } from 'react';
import styles from './FundsPage.module.css';
import NumberGrid from '@/components/NumberGrid';
import Modal from '@/components/Modal';

const FundsPage = () => {
    const [showGrid, setShowGrid] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [confirmReservation, setConfirmReservation] = useState(false);
    const [showWinner, setShowWinner] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [receiptMessage, setReceiptMessage] = useState('No se ha adjuntado comprobante');
    const fileInputRef = useRef(null);

    const raffle = {
        name: 'Rifa 1',
        description: 'Descripción de la rifa 1',
        price: '₡1000',
        date: '2024-12-01',
        image: '/placeholder.png',
    };

    const winnerNumber = 42; // Número ganador (puedes cambiarlo según tu lógica)

    const handleBuyClick = () => {
        setShowGrid(true);
    };

    const handleNumberSelect = (number) => {
        setSelectedNumber(number);
        setConfirmReservation(true);
    };

    const handleConfirmReservation = () => {
        if (!receipt) {
            alert('Por favor, sube una imagen del comprobante.');
            return;
        }
        // Aquí puedes agregar la lógica para proceder con la compra y validar el comprobante
        console.log(`Número reservado: ${selectedNumber} por ${raffle.price}`);
        console.log('Comprobante:', receipt);
        setConfirmReservation(false);
        setShowGrid(false);
        setReceipt(null);
        setReceiptMessage('No se ha adjuntado comprobante');
    };

    const handleShowWinner = () => {
        setShowWinner(true);
    };

    const handleCloseModal = () => {
        setShowGrid(false);
        setConfirmReservation(false);
        setShowWinner(false);
        setReceipt(null);
        setReceiptMessage('No se ha adjuntado comprobante');
    };

    const handleReceiptChange = (e) => {
        setReceipt(e.target.files[0]);
        setReceiptMessage(e.target.files[0] ? e.target.files[0].name : 'No se ha adjuntado comprobante');
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="container">
            <h1>Apoyo económico</h1>
            <p>Hola, cualquier apoyo económico que nos puedan brindar es de suma ayuda para la asociación y las campañas.</p>
            <h2>Donaciones</h2>
            <section style={{ padding: '20px' }}>
                <p>Tu apoyo es fundamental para continuar con nuestra labor. Puedes realizar una donación a través de los siguientes métodos:</p>
                <ul>
                    <li>Donaciones monetarias: Por medio de SINPE móvil al número celular 8888-8888</li>
                    <li>Donaciones de artículos: Contactando al número celular 8888-8888</li>
                </ul>
            </section>
            <h2>Rifas</h2>
            <section style={{ padding: '20px' , alignItems: 'center', justifyContent: 'center' , display: 'flex', flexDirection: 'column'}}>
                <p>Participa en nuestra rifa y ayuda a recaudar fondos para nuestra causa. Estas rifas se realizan cada mes y los ganadores se definen con los números ganadores de la loteria nacional. Para la compra de un número, el pago se debe realizar mediante SINPE móvil al número 8888-8888</p>
                <div className={styles.raffle}>
                    <img src={raffle.image} alt={`${raffle.name} image`} className={styles.raffleImage} />
                    <h3>{raffle.name}</h3>
                    <p>{raffle.description}</p>
                    <p>Precio: {raffle.price}</p>
                    <p>Fecha de la rifa: {raffle.date}</p>
                    <div className={styles.buttons}>
                        <button className="btn btn-primary" onClick={handleBuyClick}>Participar</button>
                        <button className="btn btn-secondary" onClick={handleShowWinner}>Consultar Ganadores</button>
                    </div>
                </div>
                {showGrid && (
                    <Modal title="Comprar Número" onClose={handleCloseModal}>
                        <NumberGrid onSelect={handleNumberSelect} />
                    </Modal>
                )}
                {confirmReservation && (
                    <Modal title="Confirmar Compra" onClose={handleCloseModal}>
                        <p>¿Desea comprar el número {selectedNumber} por un precio de {raffle.price} colones?</p>
                        <p>Debe adjuntar una imagen del comprobante del pago SINPE móvil que se realiza al número 8888-8888</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <button className="btn btn-secondary" onClick={handleFileInputClick}>Adjuntar Comprobante</button>
                        <p className={styles.tabbed}>{receiptMessage}</p>
                        <div className={styles.buttons}>
                            <button className="btn btn-primary" onClick={handleConfirmReservation}>Confirmar</button>
                            <button className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </Modal>
                )}
                {showWinner && (
                    <Modal title="Número Ganador" onClose={handleCloseModal}>
                        <p>El número ganador es: {winnerNumber}</p>
                        <div className={styles.buttons}>
                            <button className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                        </div>
                    </Modal>
                )}
            </section>
        </div>
    );
};

export default FundsPage;