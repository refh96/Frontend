'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';  // Importar el componente Link
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { setCookie } from 'nookies';
import Swal from 'sweetalert2';

function LoginCliente() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://fullwash.site/login", credentials);
      if (res.data.res) {
        // Guardar el token en una cookie
        setCookie(null, 'token', res.data.token.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 días
          path: '/',
          sameSite: 'None',
          secure: true, // Asegúrate de usar HTTPS
        });
        Swal.fire({
          title: 'Éxito!',
          text: 'Login Exitoso Redirigiendo al Dashboard',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        router.push("/dashboardCliente");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un error al iniciar sesion intente nuevamente',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
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
          Inicio Sesion
        </Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <Button variant="contained" type="submit" fullWidth>
          Login
        </Button>

        {/* Texto para redirigir a la página de registro */}
        <Typography align="center" color="black" sx={{ mt: 2 }}>
          ¿No tienes cuenta? <Link href="./register" style={{ color: 'blue', textDecoration: 'none' }}>Regístrate aquí</Link>
        </Typography>

      </Box>
      <Footer />
    </div>
  );
}

export default LoginCliente;

