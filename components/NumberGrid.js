import React, { useState } from 'react';
import styles from './styles/NumberGrid.module.css';

const NumberGrid = ({ onSelect }) => {
    const [selectedNumber, setSelectedNumber] = useState(null);

    const handleSelect = (number) => {
        setSelectedNumber(number);
        onSelect(number);
    };

    return (
        <div className={styles.grid}>
            {Array.from({ length: 100 }, (_, i) => (
                <div
                    key={i}
                    className={`${styles.cell} ${selectedNumber === i ? styles.selected : ''}`}
                    onClick={() => handleSelect(i)}
                >
                    {i}
                </div>
            ))}
        </div>
    );
};

export default NumberGrid;