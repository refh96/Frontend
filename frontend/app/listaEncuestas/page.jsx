'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  TablePagination,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { ArrowBack, Delete as DeleteIcon, Share as ShareIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const ListaEncuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (!token) {
          router.push('/loginAdmin');
          return;
        }

        const profileRes = await axios.post(
          "https://fullwash.site/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const role = profileRes.data.user.rol;
        setUserRole(role);
        if (role !== "administrador" && role !== "ayudante") {
          Swal.fire({
            title: 'Acceso Denegado',
            text: 'No tienes permisos para ver esta página',
            icon: 'error',
            confirmButtonText: 'Ok'
          }).then(() => {
            router.push('/loginAdmin');
          });
          return;
        }

        await fetchEncuestas();
        setLoading(false);
      } catch (error) {
        console.error("Error verificando usuario:", error);
        router.push('/loginAdmin');
      }
    };

    verificarAcceso();
  }, [router]);

  const fetchEncuestas = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      const response = await axios.get('https://fullwash.site/encuestas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setEncuestas(response.data.encuestas);
      }
    } catch (error) {
      console.error('Error obteniendo encuestas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las encuestas',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const cookies = parseCookies();
        const token = cookies.token;
        
        await axios.delete(`https://fullwash.site/encuestas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchEncuestas();

        Swal.fire(
          '¡Eliminado!',
          'La encuesta ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error eliminando encuesta:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la encuesta',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const handlePublish = async (encuesta) => {
    try {
      const result = await Swal.fire({
        title: '¿Publicar recomendación?',
        text: "Esta encuesta se mostrará en la sección de recomendaciones",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4caf50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, publicar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const cookies = parseCookies();
        const token = cookies.token;
        
        // En lugar de crear una nueva recomendación, actualizamos la encuesta
        encuesta.publicado = true;
        await axios.put(`https://fullwash.site/encuestas/${encuesta.id}`, encuesta, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchEncuestas(); // Actualizamos la lista de encuestas

        Swal.fire(
          '¡Publicado!',
          'La recomendación ha sido publicada exitosamente.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error publicando recomendación:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo publicar la recomendación',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress sx={{ color: 'darkorange' }} />
        <Typography>Cargando encuestas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Button
          variant="contained"
          onClick={() => {
            if (userRole === "administrador") {
              router.push('/dashboardAdmin');
            } else if (userRole === "ayudante") {
              router.push('/dashboardAyudante');
            }
          }}
          startIcon={<ArrowBack />}
          sx={{
            mb: 4,
            backgroundColor: 'darkorange',
            '&:hover': {
              backgroundColor: '#ff8c00',
            }
          }}
        >
          Volver al Dashboard
        </Button>

        <Typography variant="h4" component="h1" sx={{ mb: 4, color: 'darkorange' }}>
          Lista de Encuestas
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Comentarios</TableCell>
                <TableCell>Compartir Datos</TableCell>
                <TableCell>Mejoras Sugeridas</TableCell>
                <TableCell>Satisfacción</TableCell>
                <TableCell>Recomendaría</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {encuestas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((encuesta) => (
                  <TableRow key={encuesta.id} hover>
                    <TableCell>{encuesta.comments}</TableCell>
                    <TableCell>{encuesta.dataSharing}</TableCell>
                    <TableCell>{encuesta.improvements}</TableCell>
                    <TableCell>{encuesta.satisfaction}</TableCell>
                    <TableCell>{encuesta.wouldRecommend}</TableCell>
                    <TableCell>{encuesta.user?.username || 'Usuario Desconocido'}</TableCell>
                    <TableCell>{formatDate(encuesta.created_at)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleDelete(encuesta.id)}
                          color="error"
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: '#ffebee'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {encuesta.dataSharing === "si" && (
                          <IconButton
                            onClick={() => handlePublish(encuesta)}
                            color="primary"
                            size="small"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#e8f5e9'
                              }
                            }}
                          >
                            <ShareIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={encuestas.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count}`
          }
          sx={{
            '.MuiTablePagination-select': {
              backgroundColor: '#f5f5f5',
            }
          }}
        />
      </Container>
      <Footer />
    </Box>
  );
};

export default ListaEncuestas;
