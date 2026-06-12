import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import GuestGuard from "./GuestGuard";

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));


// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      children: [
        {
          path: '/login',
          element: ( <GuestGuard><LoginPage /></GuestGuard>)
        }
      ]
    }
  ]
};

export default LoginRoutes;
