'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from 'nookies';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

function RegistroRoles() {
  const validateEmail = (email) => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
    rol: "", // Asegúrate de que rol esté inicializado correctamente
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
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
      } catch (error) {
        console.error("Error verifying user:", error.message);
        router.push("/loginAdmin");
      }
    };

    verifyUser();
  }, [router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validaciones en el frontend
    if (!user.username || !user.numero || !user.email || !user.password || !user.rol) {
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
      const userWith = { ...user };

      const res = await axios.post("https://fullwash.site/users", userWith);

  
  
      // Verificar si la respuesta contiene un error a pesar del status 200
      if (res.status === 200) {
        // Si el backend devuelve un mensaje de error a pesar de ser un status 200
        if (res.data && res.data.length > 0 && res.data[0].message) {
          let errorMessage = res.data[0].message;
  
          // Personalizar el mensaje de error
          if (errorMessage.includes("unique validation failed on numero")) {
            errorMessage = "Este número ya está en uso.";
          } else if (errorMessage.includes("unique validation failed on email")) {
            errorMessage = "Este correo electrónico ya está en uso.";
          }
  
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'Ok',
          });
        } else {
          // Si no hay error en la respuesta, proceder con el éxito
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
      }
    } catch (error) {
      // Si el backend devuelve un error, pero con un código de estado distinto, mostrar el error
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
    <div>

      <Box display="flex" flexDirection="column" minHeight="100vh" >
      <Header />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => router.push('./dashboardAdmin')}
        sx={{ mt: 2, alignSelf: 'flex-start', fontSize: '0.75rem', padding: '4px 8px' }}
      >
        Volver
      </Button>
      <Box flex="1" p={2} component="form" onSubmit={handleSubmit}>
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
