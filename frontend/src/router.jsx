import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './components/LandingPage';
import ExchangePage from './components/ExchangePage';
import HowItWorks from './components/how-it-works';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'exchange',
        element: <ExchangePage />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorks />,
      }
    ],
  },
]);