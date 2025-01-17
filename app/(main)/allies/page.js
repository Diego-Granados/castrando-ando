"use client";

import React, { useState, useEffect } from "react";
import styles from "./AlliesPage.module.css";
import AllyController from "@/controllers/AllyController";

const AlliesPage = () => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const fetchedSponsors = await AllyController.getAllies();
        setSponsors(fetchedSponsors);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    fetchSponsors();
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
        {sponsors.map((sponsor, index) => (
          <div key={index} className={styles.sponsor}>
            <img
              src={sponsor.image}
              alt={`${sponsor.name} logo`}
              className={styles.image}
            />
            <a
              href={formatLink(sponsor.link)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sponsor.name}
            </a>
            <p>{sponsor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlliesPage;
