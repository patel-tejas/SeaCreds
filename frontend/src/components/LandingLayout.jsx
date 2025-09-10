// components/LandingLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function LandingLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}