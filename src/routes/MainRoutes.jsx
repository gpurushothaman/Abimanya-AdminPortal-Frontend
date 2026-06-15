import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from "./AuthGuard";
import DoorLocation from '../pages/doorlocation/DoorLocation';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));


// render - color
//const Color = Loadable(lazy(() => import('pages/component-overview/color')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (<AuthGuard><DashboardLayout /></AuthGuard>),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
     
    },
   {
    path: 'door-location',
    element: <DoorLocation/>
   }
    
  ]
};

export default MainRoutes;
