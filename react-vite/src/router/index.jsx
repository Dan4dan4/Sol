import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage/LandingPage'
import PortfolioPage from '../components/PortfolioPage/PortfolioPage';
import SelectedPortfolio from '../components/PortfolioPage/SelectedPortfolio';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "portfolio/:user_id",
        element: <PortfolioPage />,
      },
      {
        path: "portfolio/:user_id/:portfolio_id",
        element: <SelectedPortfolio />,
      },
    ],
  },
]);