'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { setCookie } from 'nookies';
import Swal from 'sweetalert2';

function LoginCliente() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateField = (name, value) => {
    let error = "";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Correo electrónico no válido.";
    }
    if (name === "password" && value.length < 5) {
      error = "La contraseña debe tener al menos 5 caracteres.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación en frontend
    if (!credentials.email || !credentials.password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Corrige los errores antes de continuar.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("https://fullwash.site/login", credentials);
      if (res.data.res) {
        setCookie(null, 'token', res.data.token.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 días
          path: '/',
          sameSite: 'None',
          secure: true,
        });
        Swal.fire({
          title: 'Éxito!',
          text: 'Inicio de sesión exitoso. Redirigiendo al Dashboard...',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          router.push("/dashboardCliente");
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || "Error al iniciar sesión. Inténtalo de nuevo.",
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: { xs: "90%", sm: "400px" },
          margin: 'auto',
          marginTop: { xs: 4, sm: 6 },
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h1"
          align="center"
          sx={{
            my: 2,
            color: 'primary.main',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: '2rem',
          }}
        >
          Iniciar Sesión
        </Typography>

        <TextField
          label="Correo"
          type="email"
          value={credentials.email}
          onChange={(e) => {
            const newValue = e.target.value;
            setCredentials((prev) => ({ ...prev, email: newValue }));
            validateField("email", newValue);
          }}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Contraseña"
          type="password"
          value={credentials.password}
          onChange={(e) => {
            const newValue = e.target.value;
            setCredentials((prev) => ({ ...prev, password: newValue }));
            validateField("password", newValue);
          }}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          variant="outlined"
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} />}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Iniciar Sesión
        </Button>

        <Typography color={'black'} align="center" sx={{ mt: 2 }}>
          ¿No tienes cuenta?{" "}
          <Link href="./register" style={{ color: 'blue', textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
      <Footer />
    </div>
  );
}

export default LoginCliente;
