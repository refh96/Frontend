'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

function Register() {
  const [user, setUser] = useState({
    username: "",
    numero: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (name, value) => {
    let error = "";
    if (name === "username" && value.trim() === "") error = "El nombre es obligatorio.";
    if (name === "numero" && value.length < 9) error = "El número debe tener al menos 9 dígitos.";
    if (name === "email" && !validateEmail(value)) error = "Correo electrónico no válido.";
    if (name === "password" && value.length < 5) error = "La contraseña debe tener al menos 5 caracteres.";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación en frontend
    if (Object.values(user).some((field) => !field)) {
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
      const userWithRole = { ...user, rol: "usuario" };
      const res = await axios.post("https://fullwash.online/users", userWithRole);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Redirigiendo al login...",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          router.push("/loginCliente");
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error durante el registro. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "90%", sm: "400px" },
          margin: "auto",
          marginTop: { xs: 4, sm: 6 },
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h1"
          align="center"
          sx={{
            my: 2,
            color: "primary.main",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontSize: "2rem",
          }}
        >
          Registro de Usuarios
        </Typography>

        <TextField
          label="Nombre"
          type="text"
          value={user.username}
          onChange={(e) => {
            const newValue = e.target.value;
            setUser((prevUser) => ({ ...prevUser, username: newValue }));
            validateField("username", newValue);
          }}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Número"
          type="text"
          value={user.numero}
          onChange={(e) => {
            const newValue = e.target.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
            setUser((prevUser) => ({ ...prevUser, numero: newValue }));
            validateField("numero", newValue);
          }}          
          error={!!errors.numero}
          helperText={errors.numero}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Correo"
          type="email"
          value={user.email}
          onChange={(e) => {
            const newValue = e.target.value;
            setUser((prevUser) => ({ ...prevUser, email: newValue }));
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
          value={user.password}
          onChange={(e) => {
            const newValue = e.target.value;
            setUser((prevUser) => ({ ...prevUser, password: newValue }));
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
          Registrarse
        </Button>
      </Box>
      <Footer />
    </div>
  );
}

export default Register;
