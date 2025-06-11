import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage/LandingPage'
import PortfolioPage from '../components/PortfolioPage/PortfolioPage';
import SelectedPortfolio from '../components/PortfolioPage/SelectedPortfolio';
import Stock from '../components/Stock/Stock';
import StockDetails from '../components/Stock/StockDetails';
import Watchlist from '../components/WatchlistPage/Watchlist';


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
      {
        path: "stock",
        element: <Stock />,
      },
      {
        path: "stocks/:stock_id",
        element: <StockDetails />,
      },
      {
        path: "watchlist/:watchlist_id",
        element: <Watchlist />,
      },
    ],
  },
]);