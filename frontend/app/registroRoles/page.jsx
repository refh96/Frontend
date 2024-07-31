'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';

function registroRoles() {
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
    rol: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!user.username || !user.numero || !user.email || !user.password || !user.rol) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError("");

    try {
      const res = await axios.post("https://fullwash.site/users", user);
      if (res.status === 200) {
        alert("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => {
          router.push("/loginAdmin");
        }, 2000);
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
        <h1>Registro Con roles</h1>
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
        <TextField
          label="rol"
          type="rol"
          variant="outlined"
          fullWidth
          onChange={(e) => setUser({ ...user, rol: e.target.value })}
        />
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
      </Box>
      <Footer/>
    </div>
  );
}

export default registroRoles;
