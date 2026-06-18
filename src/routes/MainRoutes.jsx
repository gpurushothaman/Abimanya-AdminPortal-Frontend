import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from "./AuthGuard";
import DoorLocation from '../pages/doorlocation/DoorLocation';
import DoorThresold from '../pages/thersold/DoorThresold';
import DoorFrame from '../pages/doorframe/DoorFrame';
import DoorThersold from '../pages/thersold/DoorThresold';
import JampLocation from '../pages/jamplocation/JampLocation';
import Architrave from '../pages/architrave/Architrave';
import DoorOrientation from '../pages/doororientation/DoorOrientation';
import FrameSize from '../pages/framesize/FrameSize';
import DoorThickNess from '../pages/doorthickness/DoorThickness';

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
   },
   {
    path:'door-frame',
    element:<DoorFrame/>
   },
   {
    path:'door-thickness',
    element:<DoorThickNess/>
   },
   {
    path:'door-thersold',
    element:<DoorThersold/>
   },
   {
    path:'jamp-location',
    element:<JampLocation/>
   },
   {
    path:'architrave',
    element:<Architrave/>
   },
   {
    path:'door-orientation',
    element:<DoorOrientation/>
   },
   {
    path:'frame-size',
    element:<FrameSize/>
   }
    
  ]
};

export default MainRoutes;
