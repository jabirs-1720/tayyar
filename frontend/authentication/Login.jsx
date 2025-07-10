import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Link,
  Stack,
  Button,
  LinearProgress
} from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from 'axios';

import { useState } from 'react';

import FlatLogo from '../src/assets/flat-logo.png';
import FlatLogoDark from '../src/assets/flat-logo-dark.png';

import { useTheme } from '@mui/material/styles';


const schema = yup.object({
  email: yup
    .string()
    .email('ادخل بريد إلكتروني صحيح')
    .required('الرقم الوظيفي مطلوب'),
  password: yup.string().required('كلمة المرور مطلوبة'),
});

const Login = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login/', data); // <-- تأكد من التوافق مع CORS
      console.log(response.data);
      // حفظ التوكن مثلاً في localStorage
    } catch (error) {
      console.log(error)
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
            <CardHeader title={"تسجيل الدخول"}/>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register('email')}
                  type='email'
                  label='البريد الإلكتروني'
                  id='email'
                  variant='filled'
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
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
                <Link to='/auth/recovery-password' variant='body2' underline='none'>نسيت كلمة المرور؟</Link>
                <br/>
                <br/>
                <Box display='flex' justifyContent='space-between'>
                  <Button variant="text">إنشاء حساب</Button>
                  <Button variant="contained" type='submit'>دخول</Button>
                </Box>
              </form>
            </CardContent>
          </Stack>
          <Box sx={{flex: 1}} display='flex' justifyContent='center' alignItems='center'>
            <img src={theme.palette.mode === "dark" ? FlatLogoDark : FlatLogo} width='50%'/>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
