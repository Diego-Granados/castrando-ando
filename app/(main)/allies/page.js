"use client";

import React, { useState, useEffect } from "react";
import styles from "./AlliesPage.module.css";
import AllyController from "@/controllers/AllyController";

const AlliesPage = () => {
  const [allies, setAllies] = useState([]);

  useEffect(() => {
    const fetchAllies = async () => {
      try {
        const fetchedAllies = await AllyController.getAllAllies();
        console.log("Fetched allies:", fetchedAllies); // Add this line for debugging
        setAllies(Object.values(fetchedAllies));
      } catch (error) {
        console.error("Error fetching allies:", error);
      }
    };
    fetchAllies();
  }, []);

  const formatLink = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      return `http://${link}`;
    }
    return link;
  };

  return (
    <div className={styles.container}>
      <h1>Nuestros Aliados</h1>
      <div className={styles["sponsors-list"]}>
        {allies.map((ally, index) => (
          <div key={index} className={styles.sponsor}>
            <img
              src={ally.image}
              alt={`${ally.name} logo`}
              className={styles.image}
            />
            <a
              href={formatLink(ally.link)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ally.name}
            </a>
            <p>{ally.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlliesPage;
