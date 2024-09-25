'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { setCookie } from 'nookies';

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
        alert("Login exitoso. Redirigiendo al Dashboard...");
        router.push("/dashboardCliente");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Hubo un error durante el Login. Inténtelo nuevamente.");
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
        <h1>Login Usuario</h1>
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

export default LoginCliente;
