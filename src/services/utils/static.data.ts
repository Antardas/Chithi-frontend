/* eslint-disable */
import blessed from '../../assets/feelings/blessed.jpg';
import excited from '../../assets/feelings/excited.jpg';
import happy from '../../assets/feelings/happy.jpg';
import loved from '../../assets/feelings/loved.jpg';
import angry from '../../assets/reactions/angry.png';
import haha from '../../assets/reactions/happy.png';
import like from '../../assets/reactions/like.png';
import love from '../../assets/reactions/love.png';
import sad from '../../assets/reactions/sad.png';
import wow from '../../assets/reactions/wow.png';
import { ConvertToJSX } from './convertToTsx.js';
import {
  FaBirthdayCake,
  FaComments,
  FaGlobe,
  FaHeart,
  FaImages,
  FaKey,
  FaLock,
  FaNewspaper,
  FaRegBell,
  FaRegUser,
  FaUser,
  FaUserCheck,
  FaUserPlus,
  FaUsers
} from 'react-icons/fa';

interface ISideBarItems {
  index: number;
  name: string;
  url: string;
  iconName: string;
}
export const sideBarItems: ISideBarItems[] = [
  {
    index: 1,
    name: 'Streams',
    url: '/app/social/streams',
    iconName: 'FaNewspaper'
  },
  {
    index: 2,
    name: 'Chat',
    url: '/app/social/chat/messages',
    iconName: 'FaComments'
  },
  {
    index: 3,
    name: 'People',
    url: '/app/social/people',
    iconName: 'FaUsers'
  },
  {
    index: 4,
    name: 'Following',
    url: '/app/social/following',
    iconName: 'FaUserPlus'
  },
  {
    index: 5,
    name: 'Followers',
    url: '/app/social/followers',
    iconName: 'FaHeart'
  },
  {
    index: 6,
    name: 'Photos',
    url: '/app/social/photos',
    iconName: 'FaImages'
  },
  {
    index: 7,
    name: 'Notifications',
    url: '/app/social/notifications',
    iconName: 'FaRegBell'
  },
  {
    index: 8,
    name: 'Profile',
    url: '/app/social/profile',
    iconName: 'FaRegUser'
  }
];

interface IFeeling {
  index: number;
  name: string;
  image: string;
}
export const feelingsList: IFeeling[] = [
  {
    index: 0,
    name: 'happy',
    image: happy
  },
  {
    index: 1,
    name: 'excited',
    image: excited
  },
  {
    index: 2,
    name: 'blessed',
    image: blessed
  },
  {
    index: 3,
    name: 'loved',
    image: loved
  }
];

export const fontAwesomeIcons = {
  FaNewspaper: ConvertToJSX(FaNewspaper, {
    className: 'icon'
  }),
  FaComments: ConvertToJSX(FaComments, {
    className: 'icon'
  }),
  FaUsers: ConvertToJSX(FaUsers, {
    className: 'icon'
  }),
  FaUserPlus: ConvertToJSX(FaUserPlus, {
    className: 'icon'
  }),
  FaHeart: ConvertToJSX(FaHeart, {
    className: 'icon'
  }),
  FaImages: ConvertToJSX(FaImages, {
    className: 'icon'
  }),
  FaRegBell: ConvertToJSX(FaRegBell, {
    className: 'icon'
  }),
  FaBirthdayCake: ConvertToJSX(FaBirthdayCake, {
    className: 'icon'
  }),
  FaRegUser: ConvertToJSX(FaRegUser, {
    className: 'icon'
  })
};

export const privacyList = [
  {
    topText: 'Public',
    subText: 'Anyone on Chithi',
    icon: ConvertToJSX(FaGlobe, {
      className: 'globe-icon globe'
    })
  },
  {
    topText: 'Followers',
    subText: 'Your followers on Chithi',
    icon: ConvertToJSX(FaRegUser, { className: 'globe-icon globe' })
  },
  {
    topText: 'Private',
    subText: 'For you only',
    icon: ConvertToJSX(FaLock, {
      className: 'globe-icon globe'
    })
  }
];

export const bgColors = [
  '#ffffff',
  '#f44336',
  '#e91e63',
  '#2196f3',
  '#9c27b0',
  '#3f51b5',
  '#00bcd4',
  '#4caf50',
  '#ff9800',
  '#8bc34a',
  '#009688',
  '#03a9f4',
  '#cddc39'
];

export const avatarColors: string[] = [
  '#FF7FA5',
  '#8DC63F',
  '#FFC0CB',
  '#53777A',
  '#F0E68C',
  '#8B0000',
  '#BDB76B',
  '#008000',
  '#A9A9A9',
  '#D2B48C',
  '#9933FF',
  '#00CED1',
  '#FFA500',
  '#C0C0C0',
  '#4169E1',
  '#FFFF00',
  '#DC143C',
  '#FF00FF',
  '#808080',
  '#0000FF',
  '#FFD700',
  '#800000',
  '#00FF00',
  '#B22222',
  '#FFFFFF'
];

export const emptyPostData = {
  _id: '',
  post: '',
  bgColor: '',
  privacy: '',
  feelings: '',
  gifUrl: '',
  profilePicture: '',
  image: '',
  userId: '',
  username: '',
  email: '',
  avatarColor: '',
  commentsCount: '',
  reactions: [],
  imgVersion: '',
  imgId: '',
  createdAt: ''
};

export const reactionsMap = {
  like,
  love,
  wow,
  sad,
  haha,
  angry
};

export const reactionsColor = {
  like: '#50b5ff',
  love: '#f33e58',
  angry: '#e9710f',
  haha: '#f7b124',
  sad: '#f7b124',
  wow: '#f7b124'
};

export const notificationItems = [
  {
    index: 0,
    title: 'Direct Messages',
    description: 'New direct messages notifications.',
    toggle: true,
    type: 'messages'
  },
  {
    index: 1,
    title: 'Follows',
    description: 'New followers notifications.',
    toggle: true,
    type: 'follows'
  },
  {
    index: 2,
    title: 'Post Reactions',
    description: 'New reactions for your posts notifications.',
    toggle: true,
    type: 'reactions'
  },
  {
    index: 3,
    title: 'Comments',
    description: 'New comments for your posts notifications.',
    toggle: true,
    type: 'comments'
  }
];

export const tabItems = (showPassword: any, showNotification: any) => {
  const items = [
    { key: 'Timeline', show: true, icon: ConvertToJSX(FaUser, { className: 'banner-nav-item-name-icon' }) },
    { key: 'Followers', show: true, icon: ConvertToJSX(FaHeart, { className: 'banner-nav-item-name-icon' }) },
    { key: 'Gallery', show: true, icon: ConvertToJSX(FaImages, { className: 'banner-nav-item-name-icon' }) },
    {
      key: 'Change Password',
      show: showPassword,
      icon: ConvertToJSX(FaKey, { className: 'banner-nav-item-name-icon' })
    },
    {
      key: 'Notifications',
      show: showNotification,
      icon: ConvertToJSX(FaRegBell, { className: 'banner-nav-item-name-icon' })
    }
  ];
  return items;
};
