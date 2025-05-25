import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../styles/layoutStyles.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <span className={styles.logoText}>GanadoPro</span>
        </div>
        
        <div className={styles.navItems}>
          <button className={styles.navButton}>Dashboard</button>
          <button className={styles.navButton}>Corrales</button>
          <button className={styles.navButton}>Ventas</button>
        </div>

        <div className={styles.userSection}>
          <span className={styles.userName}>Usuario@ejemplo.com</span>
          <button className={styles.logoutButton}>Cerrar Sesión</button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        <Outlet /> {/* Aquí se renderizarán las páginas hijas */}
      </main>
    </div>
  );
};

export default MainLayout;