import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Business,
  Language,
  Logout,
  GetApp,
  ArrowDropDown
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [language, setLanguage] = useState('العربية');

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setLanguageAnchor(null);
    // TODO: Apply language change logic
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/auth/login');
  }

  return (
    <>
      <List>
        <ListItemButton>
          <ListItemIcon>
            <GetApp />
          </ListItemIcon>
          <ListItemText primary="تصدير البيانات" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText primary="بيانات الشركة" />
        </ListItemButton>
      </List>

      <Divider />

      <List>
        <ListItemButton onClick={handleLanguageClick}>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText primary={`اللغة: ${language}`} />
          <IconButton edge="end" size="small">
            <ArrowDropDown />
          </IconButton>
        </ListItemButton>

        <Menu
          anchorEl={languageAnchor}
          open={Boolean(languageAnchor)}
          onClose={handleLanguageClose}
        >
          <MenuItem onClick={() => handleLanguageSelect('العربية')}>العربية</MenuItem>
          <MenuItem onClick={() => handleLanguageSelect('English')}>English</MenuItem>
        </Menu>

        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="تسجيل الخروج" />
        </ListItemButton>
      </List>
    </>
  );
};

export default Settings;
