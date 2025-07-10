import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6750A4',
        },
        secondary: {
          main: '#625B71',
        },
        background: {
          default: '#FFFBFE',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Tajawal, Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
