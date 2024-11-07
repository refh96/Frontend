'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function Register() {
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const validateEmail = (email) => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en el frontend
    if (!user.username || !user.numero || !user.email || !user.password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (user.numero.length < 9) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número debe tener al menos 9 dígitos.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (!validateEmail(user.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un correo electrónico válido.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    try {
      // Agregar el rol de usuario al objeto antes de enviarlo
      const userWithRole = { ...user, rol: "usuario" };

      const res = await axios.post("https://fullwash.site/users", userWithRole);
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Redirigiendo al login...',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          router.push("/loginCliente");
        }, 2000); // Redirige después de 2 segundos para que el mensaje sea visible
      }
    } catch (error) {
      // Mostrar el mensaje de error específico que proviene del backend, si existe
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error durante el registro. Inténtalo de nuevo.',
        confirmButtonText: 'Ok',
      });
      console.error("Error durante el registro:", error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flexGrow: 1, // Este hará que el contenido ocupe el espacio disponible
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '300px',
          margin: 'auto',
        }}
      >
        <Typography
          variant="h1"
          align="center"
          sx={{
            my: 4,
            color: 'darkorange',
            fontFamily: 'Helvetica',
            fontSize: '3rem',
          }}
        >
          Registro De Usuarios
        </Typography>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <TextField
          label="Número"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, numero: e.target.value })}
        />
        <TextField
          label="Correo"
          type="email"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
      </Box>
      <Footer />
    </div>
  );
}

export default Register;
