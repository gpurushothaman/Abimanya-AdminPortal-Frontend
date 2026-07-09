// assets
import { DashboardOutlined} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
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
  },
  {
    id :'dimension',
    title:'Dimension',
    type:'item',
    url:'/dimension',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
 {
    id :'door-designs',
    title:'Door Designs',
    type:'item',
    url:'/door-designs',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'sub-designs',
    title:'Door Sub Designs',
    type:'item',
    url:'/sub-designs',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'door-seamless-texture',
    title:'Door Seamless Texture',
    type:'item',
    url:'/door-seamless-texture',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'door-models',
    title:'Door Models',
    type:'item',
    url:'/door-models',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  
  {
    id :'door-frame',
    title:'Door Frame',
    type:'item',
    url:'/door-frame',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },

  {
    id :'door-frame-types',
    title:'Door Frame Types',
    type:'item',
    url:'/door-frame-types',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },

  {
    id :'door-frame-type-options',
    title:'Door Frame Type Options',
    type:'item',
    url:'/door-frame-type-options',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  
  
  {
    id :'door-thickness',
    title:'Door Thickness',
    type:'item',
    url:'/door-thickness',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'door-threshold',
    title:'Door Threshold',
    type:'item',
    url:'/door-threshold',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  {
    id :'jamb-location',
    title:'Jamb Location',
    type:'item',
    url:'/jamb-location',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },
  // {
    
  //   id :'architrave',
  //   title:'Architrave',
  //   type:'item',
  //   url:'/architrave',
  //   icon: icons.DashboardOutlined,
  //   breadcrumbs:false
  // },
  {
    id :'door-orientation',
    title:'Door Orientation',
    type:'item',
    url:'/door-orientation',
    icon: icons.DashboardOutlined,
    breadcrumbs:false
  },

  // {
  //   id :'frame-size',
  //   title:'Frame Size',
  //   type:'item',
  //   url:'/frame-size',
  //   icon: icons.DashboardOutlined,
  //   breadcrumbs:false
  // },


  ]
};

export default dashboard;
