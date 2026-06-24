import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from "./AuthGuard";
import DoorLocation from '../pages/doorlocation/DoorLocation';
import DoorThreshold from '../pages/doorthreshold/DoorThreshold';
 import DoorFrame from '../pages/doorframe/DoorFrame';
import JambLocation from "../pages/jamblocation/JambLocation";
// import Architrave from '../pages/architrave/Architrave';
import DoorOrientation from '../pages/doororientation/DoorOrientation';
 // import FrameSize from '../pages/framesize/FrameSize';
import DoorThickNess from '../pages/doorthickness/DoorThickness';
import Dimension from '../pages/dimension/Dimension';
import DoorDesign from '../pages/doordesign/DoorDesign';

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
    path:'door-threshold',
    element:<DoorThreshold/>
   },
   {
    path:'jamb-location',
    element:<JambLocation/>
   },
  //  {
  //   path:'architrave',
  //   element:<Architrave/>
  //  },
   {
    path:'door-orientation',
    element:<DoorOrientation/>
   },
  //  {
  //   path:'frame-size',
  //   element:<FrameSize/>
  //  },
     {
    path:'door-designs',
    element:<DoorDesign/>
   },
  
   {
    path:'dimension',
    element:<Dimension/>
   }
    
  ]
};

export default MainRoutes;
