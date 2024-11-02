'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
function RegistroRoles() {
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
    rol: "", // Asegúrate de que rol esté inicializado correctamente
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
          Registro Roles
        </Typography>
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
        
        <FormControl fullWidth variant="outlined">
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            value={user.rol}
            onChange={(e) => setUser({ ...user, rol: e.target.value })}
            label="Rol"
          >
            <MenuItem value="usuario">Usuario</MenuItem>
            <MenuItem value="administrador">Administrador</MenuItem>
          </Select>
        </FormControl>
        
        <Button variant="contained" type="submit" fullWidth>
          Register
        </Button>
        </Box>
      <Footer />
      </Box>
    </div>
  );
}

export default RegistroRoles;
