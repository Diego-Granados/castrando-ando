import React from 'react';
import styles from './AlliesPage.module.css';

const AlliesPage = () => {
    const sponsors = [
        { name: 'Aliado 1', logo: '/placeholder.png', website: 'https://sponsor1.com' },
        { name: 'Aliado 2', logo: '/placeholder.png', website: 'https://sponsor2.com' },
        { name: 'Aliado 3', logo: '/placeholder.png', website: 'https://sponsor2.com' },
        { name: 'Aliado 4', logo: '/placeholder.png', website: 'https://sponsor2.com' },
        // Add more sponsors as needed
    ];

    return (
        <div className={styles.container}>
            <h1>Nuestros Aliados</h1>
            <div className={styles['sponsors-list']}>
                {sponsors.map((sponsor, index) => (
                    <div key={index} className={styles.sponsor}>
                        <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                            {sponsor.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlliesPage;