import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import styles from '../styles/dashboardStyles.module.css';

const DashboardPage = () => {
  // Datos de métricas
  const metrics = [
    {
      title: "Total Ganado",
      value: "1,234",
      subtext: "Cabezas activas ~4 - 2.15% mensual"
    },
    {
      title: "Ventas Pendientes (Nú.)",
      value: "25",
      subtext: "Váser $15,000 ~4 - 5 órdenes esta semana"
    },
    {
      title: "Ventas Pendientes (Infl.)",
      value: "8",
      subtext: "Váser $65,000 ~4 - 2 órdenes esta semana"
    },
    {
      title: "Corrales Ocupados",
      value: "32/50",
      subtext: "6/5 de ocupación ~4 - 3 corrales ocupadas"
    }
  ];

  // Actividad reciente
  const activities = [
    {
      type: "Venta",
      description: "Venta de 5 novillos a Comprador X",
      time: "Hace 2 horas",
      status: "completado"
    },
    {
      type: "Registro",
      description: "Nuevo lote de 20 terrenos registrado",
      time: "Hace 5 horas",
      status: "pendiente"
    },
    {
      type: "Movimiento",
      description: "Traslado de 10 vacas al Corral C5",
      time: "Ayer",
      status: "pendiente"
    },
    {
      type: "Alerta",
      description: "Bajo nivel de alimento en Corral A2",
      time: "Ayer",
      status: "urgente"
    }
  ];

  // Acciones rápidas
  const quickActions = [
    "Registrar Nuevo Animal",
    "Crear Orden de Venta",
    "Ver Inventario de Corrales",
    "Generar Reporte Mensual"
  ];

  return (
    <MainLayout>
      <div className={styles.dashboardContainer}>
        {/* Sección de Métricas */}
        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <div key={index} className={styles.metricCard}>
              <h3 className={styles.metricTitle}>{metric.title}</h3>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricSubtext}>{metric.subtext}</div>
            </div>
          ))}
        </div>

        {/* Actividad Reciente */}
        <h2>Actividad Reciente</h2>
        <table className={styles.activityTable}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Tiempo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index}>
                <td><span className={styles.activityType}>{activity.type}</span></td>
                <td>{activity.description}</td>
                <td>{activity.time}</td>
                <td>
                  <span className={`${styles.status} ${styles[activity.status]}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Acciones Rápidas */}
        <h2>Acciones Rápidas</h2>
        <div className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <button key={index} className={styles.actionButton}>
              {action}
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;