import React from "react";
import styles from "./styles/NumberGrid.module.css";

const NumberGrid = ({ onSelect }) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 100 }, (_, number) => (
        <button
          key={number}
          className={styles.number}
          onClick={() => onSelect(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default NumberGrid;
