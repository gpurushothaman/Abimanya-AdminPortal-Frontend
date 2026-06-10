import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
//const Color = Loadable(lazy(() => import('pages/component-overview/color')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
      // children: [
      //   {
      //     path: 'default',
      //     element: <DashboardDefault />
      //   }
      // ]
    },
    // {
    //   path: 'typography',
    //   element: <Typography />
    // },
    
  ]
};

export default MainRoutes;
