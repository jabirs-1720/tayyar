import { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Pages
import Landing from '../landing/Landing';
import Login from '../authentication/Login';

// Redux setup
const initialState = {
  mode: 'dark',
  user: null,
  language: 'ar',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MODE': return { ...state, mode: action.payload };
    case 'SET_USER': return { ...state, user: action.payload };
    case 'SET_LANGUAGE': return { ...state, language: action.payload };
    default: return state;
  }
};

const store = configureStore({ reducer });

// RTL cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Not Found Page
const NotFound = () => <h1>404 - Page Not Found</h1>;

const App = () => {
  const [ mode, setMode ] = useState(store.getState().mode);

  const theme = useMemo(() =>
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
    }),
    [mode]
  );

  return (
    <Provider store={store}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="auth">
                <Route path="login" element={<Login />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
