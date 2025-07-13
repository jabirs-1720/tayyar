import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter, Routes, Route, Navigate, Outlet,
} from 'react-router-dom';
import {
  CssBaseline, ThemeProvider, createTheme,
} from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import axios from 'axios';

// Pages
import Landing from '../landing/Landing';
import Login from '../authentication/Login';
import Signup from '../authentication/Signup';
import Dashboard from '../dashboard/Dashboard';
import QuickLook from '../dashboard/QuickLook';
import Settings from '../dashboard/settings/Settings';

// RTL cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Theme config
const getTheme = (mode) =>
  createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#cddaed' : '#0052cc' },
    },
    typography: {
      fontFamily: "'Roboto', 'Noto Naskh Arabic', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover, &:active': { boxShadow: 'none' },
          },
        },
      },
    },
  });

// Route guards
const LoginRequired = () =>
  useSelector((state) => !!state.user.data) ? <Outlet /> : <Navigate to="/auth/login" replace />;

const GuestOnly = () =>
  useSelector((state) => !!state.user.data) ? <Navigate to="/dashboard" replace /> : <Outlet />;

const NotFound = () => <h1>404 - Page Not Found</h1>;

const App = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const fetchUserWithToken = async (token) => {
      const res = await axios.post('http://127.0.0.1:8000/ar/auth/token/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: 'SET_USER', payload: res.data });
    };

    const fetchUser = async () => {
      const access = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');

      if (!access) return dispatch({ type: 'CLEAR_USER' });

      try {
        await fetchUserWithToken(access);
      } catch {
        if (!refresh) return dispatch({ type: 'CLEAR_USER' });

        try {
          const res = await axios.post('http://127.0.0.1:8000/ar/auth/token/refresh/', { refresh });
          localStorage.setItem('access', res.data.access);
          await fetchUserWithToken(res.data.access);
        } catch {
          dispatch({ type: 'CLEAR_USER' });
        }
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!user.is_loaded ? <p>Hello world</p> : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />

              <Route element={<GuestOnly />}>
                <Route path="auth">
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                </Route>
              </Route>

              <Route element={<LoginRequired />}>
                <Route path="dashboard" element={<Dashboard />}>
                  <Route index element={<QuickLook />} />
                  <Route path="assays" element={<p>Assays</p>} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<p>Profile</p>} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
