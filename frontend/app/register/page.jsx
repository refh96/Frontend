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
      const res = await axios.post("http://127.0.0.1:3333/users", user);
      if (res.status === 200) {
        alert("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => {
          router.push("/loginCliente");
        }, 2000); // Redirige después de 2 segundos para que el mensaje sea visible
      }
    } catch (error) {
      alert("Error durante el registro. Inténtalo de nuevo.");
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <div>
      <Header/>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px', margin: 'auto' }}>
        <h1>Registro de usuarios</h1>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Username"
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
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
      </Box>
      <Footer/>
    </div>
  );
}

export default Register;
