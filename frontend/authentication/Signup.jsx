import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Stack,
  Button,
  Snackbar,
  LinearProgress
} from '@mui/material';
import { Link as RouteLink } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from 'axios';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FlatLogo from '../src/assets/flat-logo.png';
import FlatLogoDark from '../src/assets/flat-logo-dark.png';

import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';


const schema = yup.object({
  company: yup
    .string()
    .required('إسم الشركة مطلوبة')
    .max(100, 'يجب ان لا تتجاوز 100 حرفاً'),
  name: yup
    .string()
    .required('الإسم مطلوب')
    .max(150, 'يجب ان لا تتجاوز 150 حرفاً'),
  email: yup
    .string()
    .email('ادخل بريد إلكتروني صحيح')
    .required('الرقم الوظيفي مطلوب'),
  password: yup.string().required('كلمة المرور مطلوبة'),
});

const Signup = () => {
  // Callable variables
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema),
  });

  // Values
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [snackbarError, setSnackbarError] = useState('');

  // Functions
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const request = await axios.post(
        'http://localhost:8000/ar/auth/signup',
        data
      );

      const { refresh, access, full_name, username, email } = request.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      dispatch({
        type: 'SET_USER',
        payload: {
          full_name: full_name,
          username: username,
          email: email,
        }
      })

      navigate('/dashboard/');
    } catch (error) {
      console.log(error);
      const data = error.response?.data;

      if (data?.non_field_errors) {
        setSnackbarError(data.non_field_errors.join('\n'));
      } else if (data) {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            setError(field, {
              type: 'server',
              message: messages.join(' ')
            });
          }
        });
      } else {
        setSnackbarError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card variant="outlined" sx={{ width: '95%', maxWidth: 750 }}>
        {loading && <LinearProgress />}
        <Box display="flex">
          <Stack sx={{flex: 1}}>
            <CardHeader title={"إنشاء حساب"}/>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register('company')}
                  label='اسم الشركة'
                  id='company'
                  variant='filled'
                  error={!!errors.company}
                  helperText={errors.company ? errors.company.message : ''}
                  fullWidth
                />
                <br/>
                <br/>
                <TextField
                  {...register('name')}
                  label='الإسم الكريم'
                  id='name'
                  variant='filled'
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ''}
                  fullWidth
                />
                <br/>
                <br/>
                <TextField
                  {...register('email')}
                  type='email'
                  label='البريد الإلكتروني'
                  id='email'
                  variant='filled'
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : 'استخدم بريدك الشخصي وليس بريد الشركة'}
                  fullWidth
                />
                <br/>
                <br/>
                <TextField
                  {...register('password')}
                  type='password'
                  label='كلمة المرور'
                  id='password'
                  variant='filled'
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                  fullWidth
                />
                <br/>
                <br/>
                <Box display='flex' justifyContent='space-between'>
                  <Button variant="text" component={RouteLink} to='/auth/login'>تسجيل الدخول</Button>
                  <Button variant="contained" type='submit'>الدخول</Button>
                </Box>
              </form>
            </CardContent>
          </Stack>
          <Box sx={{flex: 1}} display='flex' justifyContent='center' alignItems='center'>
            <img src={theme.palette.mode === "dark" ? FlatLogoDark : FlatLogo} width='50%'/>
          </Box>
        </Box>
      </Card>
      <Snackbar
        open={!!snackbarError}
        autoHideDuration={3000}
        onClose={() => setSnackbarError('')}
        message={snackbarError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Signup;
