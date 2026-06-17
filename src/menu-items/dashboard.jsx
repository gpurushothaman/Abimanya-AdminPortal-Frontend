// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
{
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
    id: 'door-location',
    title: 'Door Location',
    type: 'item',
    url: '/door-location',
    icon: icons.DashboardOutlined,
    breadcrumbs: false
  },{
    id :'door-frame',
    title:'Door Frame',
    type:'item',
    url:'/door-frame',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },{
    id :'wall-thickness',
    title:'Wall Thickness',
    type:'item',
    url:'/wall-thickness',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'door-thersold',
    title:'Door Thersold',
    type:'item',
    url:'/door-thersold',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'jamp-location',
    title:'Jamp Location',
    type:'item',
    url:'/jamp-location',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    
    id :'architrave',
    title:'Architrave',
    type:'item',
    url:'/architrave',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'door-orientation',
    title:'Door Orientation',
    type:'item',
    url:'/door-orientation',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'frame-size',
    title:'Frame Size',
    type:'item',
    url:'/frame-size',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  }
  ]
};

export default dashboard;
