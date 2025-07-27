'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Button, Typography, Box, Paper, Select, MenuItem, Modal, IconButton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies, setCookie } from 'nookies';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Encuesta = () => {
  const [formData, setFormData] = useState({
    satisfaction: '',
    comments: '',
    wouldRecommend: '',
    improvements: '',
    dataSharing: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const cookies = parseCookies();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post('https://fullwash.online/login', loginData);
      
      if(res.data.res) {
        // Guardar el token
        setCookie(null, 'token', res.data.token.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 días
          path: '/',
          sameSite: 'None',
          secure: true,
        });
        
        // Primero cerramos el modal
        () => setShowLoginModal(false)
        // Luego mostramos el mensaje de éxito
        toast.success('Inicio de sesión exitoso');
        
        // Limpiamos el formulario de login
        setLoginData({
          email: '',
          password: ''
        });
        
        // Finalmente intentamos guardar la encuesta
        if (formData.satisfaction) {
          await handleSaveSurvey(formData);
        }
      } else {
        toast.error('Credenciales inválidas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + (error.response?.data?.message || 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSurvey = async (surveyData) => {
    try {
      const token = cookies.token;
      if (!token) {
        setShowLoginModal(true);
        return;
      }

      const response = await axios.post('https://fullwash.online/encuestas', surveyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire('Éxito', 'Encuesta guardada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la encuesta', 'error');
      console.error('Error al guardar la encuesta:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSaveSurvey(formData);
    } catch (error) {
      toast.error('Error al enviar la encuesta');
      console.error('Error:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <Header />
    <Box
    
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <ToastContainer />
      
      {/* Modal de Login */}
      <Modal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        aria-labelledby="modal-login"
        aria-describedby="modal-login-form"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography color={'black'} variant="h6" component="h2">
              Iniciar Sesión Para responder Encuesta
            </Typography>
            <IconButton onClick={() => setShowLoginModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <form onSubmit={handleLogin}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={loginData.email}
              onChange={handleLoginInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="password"
              label="Contraseña"
              type="password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </Box>
      </Modal>

      <Paper
        elevation={3}
        sx={{ maxWidth: 600, width: '100%', padding: 4, backgroundColor: 'white', borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', marginBottom: 3, color: 'black' }}
        >
          Encuesta de Satisfacción
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Satisfacción */}
          <FormLabel component="legend" sx={{ color: 'black', marginBottom: 1 }}>
            ¿Qué tan satisfecho está con nuestro servicio?
          </FormLabel>
          <Select
            name="satisfaction"
            value={formData.satisfaction}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 3 }}
            required
          >
            <MenuItem value="">Seleccione una opción</MenuItem>
            <MenuItem value="muy-satisfecho">Muy satisfecho</MenuItem>
            <MenuItem value="satisfecho">Satisfecho</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="insatisfecho">Insatisfecho</MenuItem>
            <MenuItem value="muy-insatisfecho">Muy insatisfecho</MenuItem>
          </Select>

          {/* Recomendar */}
          <FormLabel component="legend" sx={{ color: 'black', marginBottom: 1 }}>
            ¿Recomendaría nuestro servicio a otros?
          </FormLabel>
          <RadioGroup
            name="wouldRecommend"
            value={formData.wouldRecommend}
            onChange={handleChange}
            sx={{ marginBottom: 3 }}
            row
          >
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Mejoras */}
          <TextField
            name="improvements"
            label="¿Qué podríamos mejorar?"
            value={formData.improvements}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ marginBottom: 3 }}
          />

          {/* Comentarios */}
          <TextField
            name="comments"
            label="Comentarios adicionales"
            value={formData.comments}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ marginBottom: 3 }}
          />

          {/* Autoriza compartir datos */}
          <FormLabel component="legend" sx={{ color: 'black', marginBottom: 1 }}>
            ¿Autoriza a que sus datos sean publicados o prefiere no compartirlos?
          </FormLabel>
          <RadioGroup
            name="dataSharing"
            value={formData.dataSharing}
            onChange={handleChange}
            sx={{ marginBottom: 3 }}
            row
          >
            <FormControlLabel value="si" control={<Radio />} label="Sí, autorizo" />
            <FormControlLabel value="no" control={<Radio />} label="No, prefiero no compartir" />
          </RadioGroup>

          {/* Botón de enviar */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Enviar Encuesta
          </Button>
        </form>
      </Paper>
    </Box>
    <Footer />
    </Box>
  );
};

export default Encuesta;
