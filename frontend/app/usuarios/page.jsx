'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';
import {
    Box,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import axios from 'axios';

import Header from '../components/Header';
import Footer from '../components/Footer';
const AdminUsuarios = () => {
    const [loading, setLoading] = useState(true); // Estado de carga
    const [usuarios, setUsuarios] = useState([]);
    const router = useRouter();
    
    useEffect(() => {
        // Función para obtener la lista de usuarios
        const fetchUsuarios = async () => {
            const cookies = parseCookies();
            const token = cookies.token;
            try {
                const response = await axios.get('https://fullwash.site/users',
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    });
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        const verifyUser = async () => {
          try {
            const cookies = parseCookies();
            const token = cookies.token;
    
            if (!token) {
              router.push("/loginAdmin");
              return;
            }
    
            const res = await axios.post(
              "https://fullwash.site/profile",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
            const userRole = res.data.user.rol;
            if (userRole !== "administrador") {
              router.push("/loginCliente");
              return;
            }
    
            setLoading(false); // Detener el estado de carga si es administrador
            fetchUsuarios();
            } catch (error) {
            console.error("Error verifying user:", error.message);
            router.push("/loginAdmin");
          }
        };
    
        verifyUser();
      }, [router]);
    

    // Función para manejar el cambio de rol
    const handleRoleChange = async (id, newRole) => {
        const cookies = parseCookies();
        const token = cookies.token;
        try {
            await axios.put(`https://fullwash.site/users/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                }, { rol: newRole });
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((user) =>
                    user.id === id ? { ...user, rol: newRole } : user
                )
            );
            alert('Rol actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
            alert('Error al actualizar el rol');
        }
    };

    // Función para eliminar un usuario
    const handleDelete = async (id) => {
        const cookies = parseCookies();
            const token = cookies.token;
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (confirmDelete) {
            try {
                await axios.delete(`https://fullwash.site/users/${id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    });
                setUsuarios((prevUsuarios) => prevUsuarios.filter((user) => user.id !== id));
                alert('Usuario eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                alert('Error al eliminar el usuario');
            }
        }
    };

    return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => router.push('./dashboardAdmin')}
        sx={{ mt: 2, alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 8px' }}
      >
        Volver
      </Button>
      <Box flex="1" p={2}>
        <Container>
        <Typography variant="h4" color="darkorange" gutterBottom textAlign={"center"}>
                Administracion de Usuarios
              </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre de Usuario</TableCell>
                            <TableCell>Número</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.id}</TableCell>
                                <TableCell>{usuario.username}</TableCell>
                                <TableCell>
                                    <a
                                        href={`https://wa.me/${usuario.numero}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {usuario.numero}
                                    </a>
                                </TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>
                                    <FormControl variant="standard">
                                        <Select
                                            value={usuario.rol}
                                            onChange={(e) => handleRoleChange(usuario.id, e.target.value)}
                                        >
                                            <MenuItem value="usuario">Usuario</MenuItem>
                                            <MenuItem value="administrador">Administrador</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            window.open(`https://wa.me/${usuario.numero}`, '_blank')
                                        }
                                    >
                                        Contactar por WhatsApp
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(usuario.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
        </Box>
      <Footer />
      </Box>
    );
};

export default AdminUsuarios;
