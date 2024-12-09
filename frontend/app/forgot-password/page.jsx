'use client';

import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('../api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al enviar solicitud');

      setMessage('Se ha enviado un correo de recuperación. Por favor, revisa tu bandeja de entrada.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header fijo */}
      <Header />
  
      {/* Contenido principal centrado */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          px: 2 
        }}
      >
        <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <Typography color="black" variant="h5" mb={2}>
            Recuperar Contraseña
          </Typography>
          <Typography color="black" variant="h6" mb={2}>
            Ingresa el correo electrónico con el que te registraste
          </Typography>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Enviar correo de recuperación
            </Button>
          </form>
        </Box>
      </Box>
  
      {/* Footer fijo */}
      <Footer />
    </Box>
  );
}
