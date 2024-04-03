import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Auth from './auth/auth.js';
import MainScreen from './main_screen/main_screen.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Auth />} />
        <Route path="main" element={<MainScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
