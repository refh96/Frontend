'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';

function Register() {
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!user.username || !user.numero || !user.email || !user.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError(""); // Limpiar mensajes de error previos

    try {
      // Agregar el rol de usuario al objeto antes de enviarlo
      const userWithRole = { ...user, rol: "usuario" };
      
      const res = await axios.post("https://fullwash.site/users", userWithRole);
      if (res.status === 200) {
        alert("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => {
          router.push("/loginCliente");
        }, 2000); // Redirige después de 2 segundos para que el mensaje sea visible
      }
    } catch (error) {
      alert("Error durante el registro. Inténtalo de nuevo.");
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
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
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
