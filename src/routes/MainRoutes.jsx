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
import SubDesign from '../pages/doorsubdesign/SubDesign';
import DoorModel from '../pages/doormodel/DoorModel';
import DoorFrameType from '../pages/doorFrameType/DoorFrameType';
import DoorFrameTypeOptions from '../pages/doorFrameTypeoptions/DoorFrameTypeOptions';
import DoorSeamlessTexture from '../pages/doorSeamlessTexture/DoorSeamlessTexture';

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
    path:'door-frame-types',
    element:<DoorFrameType/>
   },
   {
    path:'door-frame-type-options',
    element:<DoorFrameTypeOptions/>
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
    path:'sub-designs',
    element:<SubDesign/>
   },
    {
    path:'door-models',
    element:<DoorModel/>
   },
   {
    path:'dimension',
    element:<Dimension/>
   },
   {
    path:'door-seamless-texture',
    element:<DoorSeamlessTexture/>
   },
   
    
  ]
};

export default MainRoutes;
