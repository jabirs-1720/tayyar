// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Redux
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Files
import App from './App.jsx'

// Redux setup
const theme = localStorage.getItem('theme') || 'dark';
const initialState = {
  mode: theme,
  user: {data: null, is_loaded: false},
  language: 'ar',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MODE':
      localStorage.setItem('theme', action.payload);
      return { ...state, mode: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: {data: action.payload, is_loaded: true},
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: {data: null, is_loaded: true},
      };
    case 'SET_LANGUAGE': return { ...state, language: action.payload };
    default: return state;
  }
};

const store = configureStore({ reducer });

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </StrictMode>,
)