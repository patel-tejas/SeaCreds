import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAppConfig } from './context/configContext';

export default function App() {
  const config = useAppConfig();
  
  return (
    <div className="app">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}