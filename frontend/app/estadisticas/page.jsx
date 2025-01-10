'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Button, IconButton, Tooltip } from '@mui/material';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ArrowBack, PictureAsPdf } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const EstadisticasEncuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const reportRef = useRef(null);

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          Swal.fire({
            title: 'Acceso Denegado',
            text: 'Debes iniciar sesión para ver las estadísticas',
            icon: 'error',
            confirmButtonText: 'Ir al Login'
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/loginAdmin');
            }
          });
          return;
        }

        try {
          // Verificar el perfil y rol del usuario
          const profileRes = await axios.post(
            "https://fullwash.site/profile",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Verificar si el usuario es administrador
          if (profileRes.data.user.rol !== "administrador") {
            Swal.fire({
              title: 'Acceso Restringido',
              text: 'Solo los administradores pueden ver las estadísticas',
              icon: 'warning',
              confirmButtonText: 'Entendido'
            }).then(() => {
              router.push('/'); // Redirige a la página principal
            });
            return;
          }

          // Si el usuario es admin, procedemos a cargar las estadísticas
          const response = await axios.get('https://fullwash.site/encuestas', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            setEncuestas(response.data.encuestas);
          } else {
            setError('No se pudieron cargar las estadísticas');
          }
        } catch (authError) {
          console.error('Error al verificar autenticación:', authError);
          Swal.fire({
            title: 'Error de Autenticación',
            text: 'Por favor, inicie sesión nuevamente',
            icon: 'error',
            confirmButtonText: 'Ir al Login'
          }).then(() => {
            router.push('/loginAdmin');
          });
        }
      } catch (error) {
        console.error('Error general:', error);
        if (error.response?.status === 401) {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'error',
            confirmButtonText: 'Ir al Login'
          }).then(() => {
            router.push('/loginAdmin');
          });
        } else {
          setError('Error al acceder a las estadísticas');
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    verificarAcceso();
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Cargando estadísticas...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!encuestas.length) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">No hay datos de encuestas disponibles.</Typography>
      </Box>
    );
  }

  // Función para calcular estadísticas de satisfacción
  const calcularEstadisticasSatisfaccion = () => {
    const stats = {
      'muy-satisfecho': 0,
      'satisfecho': 0,
      'neutral': 0,
      'insatisfecho': 0,
      'muy-insatisfecho': 0,
    };

    encuestas.forEach(encuesta => {
      if (stats.hasOwnProperty(encuesta.satisfaction)) {
        stats[encuesta.satisfaction]++;
      }
    });

    return {
      labels: Object.keys(stats).map(key => key.replace('-', ' ').toUpperCase()),
      datasets: [{
        data: Object.values(stats),
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFC107',
          '#FF9800',
          '#F44336',
        ],
      }],
    };
  };

  // Función para calcular estadísticas de recomendación
  const calcularEstadisticasRecomendacion = () => {
    const recomendaciones = {
      'si': 0,
      'no': 0,
    };

    encuestas.forEach(encuesta => {
      if (recomendaciones.hasOwnProperty(encuesta.wouldRecommend)) {
        recomendaciones[encuesta.wouldRecommend]++;
      }
    });

    return {
      labels: ['Recomendarían', 'No Recomendarían'],
      datasets: [{
        data: [recomendaciones.si, recomendaciones.no],
        backgroundColor: ['#4CAF50', '#F44336'],
      }],
    };
  };

  // Función para calcular estadísticas mensuales
  const calcularEstadisticasMensuales = () => {
    const meses = {};
    
    encuestas.forEach(encuesta => {
      const fecha = new Date(encuesta.created_at);
      const mesAno = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      
      if (!meses[mesAno]) {
        meses[mesAno] = 0;
      }
      meses[mesAno]++;
    });

    return {
      labels: Object.keys(meses),
      datasets: [{
        label: 'Encuestas por Mes',
        data: Object.values(meses),
        backgroundColor: '#2196F3',
      }],
    };
  };

  // Calcular resumen general
  const calcularResumenGeneral = () => {
    const total = encuestas.length;
    const satisfechos = encuestas.filter(e => 
      e.satisfaction === 'muy-satisfecho' || e.satisfaction === 'satisfecho'
    ).length;
    const recomendarian = encuestas.filter(e => e.wouldRecommend === 'si').length;

    return {
      total,
      satisfechos,
      recomendarian,
      porcentajeSatisfaccion: ((satisfechos / total) * 100).toFixed(1),
      porcentajeRecomendacion: ((recomendarian / total) * 100).toFixed(1),
    };
  };

  const resumen = calcularResumenGeneral();

  // Función para exportar a PDF
  const exportarPDF = async () => {
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Obtener la fecha actual formateada
      const fecha = new Date().toLocaleDateString('es-ES');
      const nombreArchivo = `Reporte_Encuestas_${fecha}.pdf`;
      
      pdf.save(nombreArchivo);
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'El reporte se ha exportado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo exportar el reporte',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        maxWidth: 1400, 
        mx: 'auto',
        width: '100%'
      }}>
        {/* Cabecera y Controles */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/dashboardAdmin')}
            startIcon={<ArrowBack />}
            sx={{
              backgroundColor: 'darkorange',
              '&:hover': {
                backgroundColor: '#ff8c00',
              }
            }}
          >
            Volver al Dashboard
          </Button>

          <Tooltip title="Exportar a PDF">
            <IconButton 
              onClick={exportarPDF}
              sx={{ 
                color: 'darkorange',
                '&:hover': { backgroundColor: 'rgba(255, 140, 0, 0.1)' }
              }}
            >
              <PictureAsPdf />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Contenido del Reporte */}
        <Box ref={reportRef}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              color: 'darkorange',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Estadísticas de Encuestas
          </Typography>

          {/* Tarjetas de Resumen */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">Total de Encuestas</Typography>
                  <Typography variant="h3">{resumen.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">Satisfacción General</Typography>
                  <Typography variant="h3">{resumen.porcentajeSatisfaccion}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">Tasa de Recomendación</Typography>
                  <Typography variant="h3">{resumen.porcentajeRecomendacion}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                  Niveles de Satisfacción
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={calcularEstadisticasSatisfaccion()} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                  Tasa de Recomendación
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={calcularEstadisticasRecomendacion()} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                  Encuestas por Mes
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={calcularEstadisticasMensuales()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default EstadisticasEncuestas;
