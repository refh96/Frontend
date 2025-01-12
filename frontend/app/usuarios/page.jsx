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
    IconButton,
} from '@mui/material';
import { ArrowBack, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
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
                // Verificar si la respuesta es exitosa y contiene users
                if (response.data.success && response.data.users) {
                    setUsuarios(response.data.users);
                } else {
                    console.error('Formato de respuesta inesperado:', response.data);
                    setUsuarios([]);
                }
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
                setUsuarios([]);
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
        <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#f5f5f5' }}>
            <Header />
            
            {/* Container principal con padding y máximo ancho */}
            <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                maxWidth: 1400, 
                mx: 'auto',
                width: '100%'
            }}>
                {/* Botón de regreso con mejor diseño */}
                <Button
                    variant="contained"
                    onClick={() => router.push('./dashboardAdmin')}
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

                <Paper 
                    elevation={3} 
                    sx={{ 
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ p: 3, backgroundColor: 'white' }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                color: 'darkorange',
                                mb: 3,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            Administración de Usuarios
                        </Typography>
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nombre de Usuario</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Número</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Rol</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usuarios.map((usuario) => (
                                        <TableRow 
                                            key={usuario.id}
                                            sx={{ 
                                                '&:hover': { 
                                                    backgroundColor: '#f8f8f8' 
                                                }
                                            }}
                                        >
                                            <TableCell>{usuario.id}</TableCell>
                                            <TableCell>{usuario.username}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`https://wa.me/${usuario.numero}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                        color: 'darkorange',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    {usuario.numero}
                                                </a>
                                            </TableCell>
                                            <TableCell>{usuario.email}</TableCell>
                                            <TableCell>
                                                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                                    <Select
                                                        value={usuario.rol}
                                                        onChange={(e) => handleRoleChange(usuario.id, e.target.value)}
                                                        sx={{
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: 'darkorange',
                                                            },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: '#ff8c00',
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem value="usuario">Usuario</MenuItem>
                                                        <MenuItem value="administrador">Administrador</MenuItem>
                                                        <MenuItem value="ayudante">Ayudante</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<WhatsAppIcon />}
                                                    onClick={() => window.open(`https://wa.me/${usuario.numero}`, '_blank')}
                                                    sx={{
                                                        mr: 1,
                                                        backgroundColor: '#25D366',
                                                        '&:hover': {
                                                            backgroundColor: '#128C7E',
                                                        },
                                                    }}
                                                >
                                                    WhatsApp
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDelete(usuario.id)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgb(211, 47, 47)',
                                                        },
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Paper>
            </Box>
            <Footer />
        </Box>
    );
};

export default AdminUsuarios;
