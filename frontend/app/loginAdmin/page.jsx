'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { setCookie } from 'nookies';

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:3333/login", credentials);
      if (res.data.res) {
        const { rol, token } = res.data;
        if (rol === "administrador") {
          // Guardar el token en una cookie
          setCookie(null, 'token', token.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 días
            path: '/',
            sameSite: 'None',
            secure: true,
          });
          alert("Login exitoso. Redirigiendo al Dashboard...");
          router.push("/dashboardAdmin");
        } else {
          alert("Acceso denegado. Solo los administradores pueden acceder.");
        }
      }
    } catch (error) {
      console.error("Error durante el login:", error.message);
      alert("Hubo un error en el login. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '300px',
          margin: 'auto',
          flexGrow: 1, // Esto permitirá que el Box ocupe el espacio disponible
          justifyContent: 'center', // Centrar verticalmente
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
          Inicio Sesion Administrativo
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
      </Box>
      <Footer />
    </div>
  );
}

export default Login;
