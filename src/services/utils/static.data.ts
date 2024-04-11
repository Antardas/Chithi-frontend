/* eslint-disable */
import blessed from '~/assets/feelings/blessed.jpg';
import excited from '~/assets/feelings/excited.jpg';
import happy from '~/assets/feelings/happy.jpg';
import loved from '~/assets/feelings/loved.jpg';
import angry from '~/assets/reactions/angry.png';
import haha from '~/assets/reactions/happy.png';
import like from '~/assets/reactions/like.png';
import love from '~/assets/reactions/love.png';
import sad from '~/assets/reactions/sad.png';
import wow from '~/assets/reactions/wow.png';
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
  // FaUserCheck,
  FaUserPlus,
  FaUsers
} from 'react-icons/fa';
import { IPost, IDropdownOption } from '~/types/post.js';

export interface ISideBarItems {
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

export interface IFeeling {
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

export const privacyList: IDropdownOption[] = [
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

export const emptyPostData: IPost = {
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
interface IReactionIcon {
  [reaction: string]: string;
}
export const reactionsMap: IReactionIcon = {
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

export const DefaultAvatarImageDataUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAEEVJREFUeJztnXu0XVV1h7/7CImQBMIzAUkgSBEhgiCDRwOEFBEiiFJsOxyt7RBEUWmRatMi0lTFVkGxorQDrTispb4tOuxABYI4RPBBeATkIWAokEAMSXjkeXNv/5j34g1kz732OWevtR+/b4z117p3n99Za8591mOuuUAIIYQQQgghhBBCCCGEEEIIIYQQv6cvtYAW0Q/MBA4YV/YBdgQmA1NGC8Cz48ozwG+B+8eVZcBINOUtRg5SHn3AHGD+aDkOc4ZesAa4GbhxtCxFDiNqwhHAFcCTmNHGKCuAzwCvjfD9hCjMrsDfA/cSzymyyj3AQmCXUr+xEAHsCVwOPE96x3hxeQ74JDCjtG8vRAbTgX8HNpDeEfLKBuBKYI9SWkKIcQwAfwOsJb3hFy1rgPNGv4MIRKtY4RyNvYkP7eIZG4HbsaXaB0bLb4GV2JBoEzAB2A5b+t0FG8bNxpaFDxktk7rQsAQ4F7iti2cI8QL9wCJgC529uW8b/f95dGfYY0zAnPVDo88e7kDT0Oj/9/dAj2gx07F9hqIGeB9wEbBfBI17Y6tW93eg83o0NxEdchy2v1DE4BYDC0gzdO0DTgZuCtQ6VpYDc+PLFXXmzRRboVqMbRBWhaOAHxOufz1wehKlona8AxujhxjWQ5gzVZU3YRpD5yVnpZEp6sLfEWZMw8BlwMQ0MguxPfBpwhcZPpBGpqg67yTMgB4FTkiksRuOAx4n7DuenUijqChnEPaGvQGYlkhjL9gd+w4hw603JdIoKsbxhE3Ir8L2IOrOAPZdQibuxybSKCrCnsBT5BvLhakElsjF5H/vFdhekGghA4TtGTTROcZYSNiwUjvuLeQj5BvHxcnUxSPkl2RRKnEiDXPJn5RflUxdfPLmJFuAY5KpE1EZBO7GN4jFNGNCHsogFpfltcmdKFS+Fbwf3xCW0c7jqruSv09yfjJ1Igp7Yal0sgxgGAtLbyvz8Ieea9ER3kbzRfw35KfSSasMl+K30efTSRNlMhM7sZfV8Q/QmwNNdWd77JRjVjttBF6eSpwoj8/hvxkV7v17TsVvq8+kkybKYDoWOpHV4Temk1ZZbiK7vdahk4iNYhH+G/GwZMqqy9FoE7UV9AEPk93RP0onrfL8kOx2ezChLtFDjsV/E56cTlrlWYDfdtpdbwCfJ7uD70moqw704WdL+bd00kQvGABWk93BC9NJqw0fJLv9VqFI31pzJP4QYVY6abVhX/w2PDydtPJpuvfPd+puxeKuhM8j+GlKvTauPW12kGujqag/P3DqGu0gTWYCtqGlFZjumUt2Oz6HhcuLmvEqsjt1PZZBXYQxiB+JcEA6aeXS5CGW12k/xwIXRRhD2EWhWchBaojXafdGU9Ecljh1cpAa4nWawiSK471U5CA1ZF+n7jfRVDSH/3PqZkdTEZkmO8iOTp32P4rjOcjUaCoi02QHmeLUPRtNRXNY6dTJQWrIZKfuuWgqmsN6p857GdWaJjuI12lykOKsc+rkIDXEu9xGeyDF2ezUNXbTtckOMuTUNbZDS8Rrs8a+cJrsIK0cEpSI12ZeW9eaJjvIWqeujalFu8VrszXRVESmyQ7iLUvuFU1Fc9jTqXsqmorINNlBvI2tfWKJaBDebvlj0VREpskO4oWTNDZ2qES8NrsrmorINNlB7nfqDommojl4bfbraCpEzziC7AM+q7GUNiKMAfxrI/ZLJ010ysuwza2sTp2TTlrtOJzsdnw6oa7SafIQaz1wh1N/YiwhDcBrq59FU5GAJjsIwM1O3Ruiqag/pzp1N8USIXrPKWQPDTajDcMQpuNfy3ZoOmmiWyZhkbtZnXtuOmm14Xyy28/baxI14Wtkd/CvEuqqC3eS3X6fTahL9IjT8XPLHpVOWuXJuzpCCx0NYDvgd2R38jfSSas815LdbivRsYHGcBnZHb0Fy8IotubV2L3xWe12aTppotfsix2gyursb6WTVlm+S3Z7DaGAz8ZxDf54+th00irHPPy2+q9kykRpHIi/nn8XylIOlhV/KdntNAwclEydKJUv4b8ZL0ymrDpcjN9G16STJspmL+B5sjt/I+3eGT4MS8CQ1T4b8FO6igbwD/hvyPtoZ1KHKfg32o4AH0umTkRjApap3DOEtu2N9GEreV6bPIQdIRAt4ER8YxgBPpxMXXw+ht8Ww8AfJVMnknAF+U7yrmTq4vHX5LfDFcnUiWRMwpZ2PcPYArwtlcAIvAN/t3xs+XtSKoEiLftjSc/ynOTsVAJL5HzynWMN1kaixZyCH4YyVi5KJbDH9AGfIP/7DgELEmkUFePd5BvMCPDfwA6JNPaCnfBjrMaXdyfSKCrKIsIM517qmRHlSGypNuQ7LkojUVSdjxNmQBuAD2D5oqrOROCjhA0jR4B/SSNT1IUPkT95HSu/xN7MVeUk8nfHx8owzZlniZJ5C/YrEWpY36FaEa6vAf6XMP0jWA6xM5MoFbXlWCxrYKiRbQG+ChyTQuwoJwDfI1zzCHYcOaVmUWP+gPy4rW2Vu7BNOO+u9l4xA7gA/wxHVrkHeEUEjaLB7AB8meLGN4JNjK8H3os5Wy8SZvdjYekLgZ/gHwLzypep95J1FJThPJyzsJikbiJa1wC/wHIG3wc8AjwBrMLOqfRjfTKMGe+u2BmW2cArsSsIXgtM7ULDesxhv9jFM4TYJnMww+7kjV2F8mvg4J63ihDjmAx8hfTGXrT8JxpSFabp2d3LYA/gbuCZ1EIK8Aw2iZ+eWohoJgdgm2h3kP6XoNuyBPggtmggRMcchMUkdbJ8WpdyN5bF5MDeNJloOnsA78fPaN7Ucgfwt6NtIMQL9AEnY+Ei3p2GZZZhtt7PGCI8HqzXZTPwbSyOq/XbAG1ugInY3sYFlHdL61osWPA3wDLgMWA58CQW4rEam0BvHP37sf4YGadxKjAN2A17u88AXo7lxt0fm0uUlaboAeBy4OpxGltFGx1kZ+A9o6WXw4lHsE3A27Eh2j3Eu4FpJjZnOgS7kfYIYFYPn78C2yS9EtvsFA1kd+y8h3ffd2gZwpzhcuCM0WdXjT2BP8UM+3Y6D0kZX54B/hnb4RcNYRrWqd5dhSFlJRae8Wa6C/VIxTTgT7AYrFV01xbPYoewYgRjipKYgM0vVtO5ITwNXIUlTavD6cFQBoHXAV+gu/ZZBZxHs9qmFbweizvqpNO3YIeNzqAdV4xNxA5LXUfnK2dLUebFWjATW6LspJNXY9eKtTl7+X7YvGotnbXhN7DoY1Ex+oH30dk8Y9no/06Orrq6TMWGp4/S2fzkPBTnVxn2B26heEc+CPwVulXKYwLwdsLTBY0vP8HOsYiEnEXxX40Hgb9AE8siDAJ/iW14Fv01eXsCva1nGvn3Wby4PAGcg34xumEQy3i/nGJt/02sz0QEjsLmDaGdsxFbs9dhod4xGUsw513Xtq253lEpxLaJ91KsU36KQrnL5GDgVsL7YxMW4iN6zBQscXRoR6zFhgJtjDWLTT9m9EVCeK5Bq4Y9Y3csxWdo418H7J1EabuZBdxAeD/9nGrGsNWKg7Ao2ZAGX4cNwUQ6+rCLeULTtj6MpTMSHXAc4XFCS4FXpZEptsGhhCfNfhqYm0ZmfXkjluAspIGvRtcTV5HJWK7ikD5cD5yWRmb9+DPCjr5uBN6ZSKMI532E9edmLBxfOPw5YRe9rEAZyevE8cBT5PfrEPDWRBorz1sJc46l9PY4qYjDvoQdQRjCRhFiHG8k7Gf4RnSKrc5Mw4IYQ4ZbmpOMcgJhy4Jfpx0HmJrOJOBawibuxyfSWBkOJexwztXofEGTGMSSaef1+1osU0srmYlF2OY10hdQyEgT6ceSYOT1/+NYHrBWsQNh6T2/hJyjyfQTdnvXHbQoGrsP+B/C5hwaVjWfAcLyCHyblrws/4n8xrgOTcjbxERgMfl28Y+pBMbiNPJTy9xGi35OxQtMxTJAerYxDCxIJbBs9iH/3vEHUVrLNjOd/OjtVTRwo3gC9suQ98X3TyVQVIYDsQTZnq38jIblFrgE/wtvwjYMhQC7myQv7OijydT1mPnkZxbXQSfxYi7At5ktwLxU4nrFVOyyGO+LfiWZOlF1voZvO8sp7/KgKOQNrR5Ah/dFNlOwhRvPhi5Jpq5LDsGP0B1G8w6Rz5H4drQJmJNMXYf0Y1krPM//VDJ1om5cjG9Lt1KzXfZz8b/QvdjuqRAhDJKf+unsZOoKsgv+huAQ9rMpRBEOxs+quRLYKZm6AnwO39MvTydN1JyPUHPbeiX+Bs+jaNVKdM5E/FWtTcArkqkL4Dv4Hn5mOmmiIZyCb2NfTyfN50h84TekkyYaxvfwtw8OSyctmx+SLXoL8Op00kTDOAB/b+T76aRtm6Pxfz3+I5000VCuxLe5I9JJeynfJ1voelp46F6UzgzgebLt7tp00rZmDjVfehO15TL8uUglbhfzslKsx06JCVEGe+D/iiQf2k/HsqxnCbwinTTREv6VbPvbAOyWTpplmcgSt5kGnh0WlWMW/orWRamEDQKPOcK+mkqYaB3eBa+PYrm3onO6I2oE3Ykt4nEMvi2+IYUoL0P3L1IIEq3Gy6n1zdhidsMf99UmNl80hneRbY8bgZ1jinmPI+ZZlBlRxGcqdhV4ll1Gvc/SuyXo6phChBiHN1m/KZaIGfj5defHEiLEi1hAtl1uAXaPIcI7b74cXVkg0jEBS2GbZZ/nFH1gJ8bsXa74LezXRYgUbMYO7WVR+sWg22PxVVkeemLZAoTI4TSy7XMddoloaXjHHdfQsIzbopZMwl/NOqnIw4oOsV7n1F2PJWwQIiUbgB879Z4Nv4SiDjLPqbuu4LOEKAvPFueV9aE74l9jMLusDxaiIN4hviFsU7HnnOR86LIyPlCIDunDMi12vZhUZIjlpQv9aYHnCFE2I8AtTv3RoQ8q4iCHO3W3FniOEDHwHOQ1oQ8p4iD7OXW/KvAcIWLwS6fOs+WtKOIg3vXMjxR4jhAx8Gwy+KrxIg6ynVO3rsBzhIiBZ5OeLW9FEQfZ6NQpY7uoGt7lnp4tb0URB1np1FU65bxoJd6+nGfLW1HEQR526o4p8BwhYuAlDXko9CFFHOR2p+6PCzxHiBi8xalbUsYHzsVPrfKHZXyoEB0wH99WSxnxDABPOh96CzpNKNIzgH8jbqmnXi91PngEuLCsDxYikA/j2+jHy/zwmfhX8Q4DbytTgBAO5+A7x0Zg77JFfDZHxDCwCA23RDwGgUvw7XIE+HQMMTvjz0XGym3A8TEEiVYzH3/OMVYeB3Yq+vC+DkWdCnw38P/vxHKj3oLFxzyHCRaiKH1Y1MZsbNX0TOxwVB7DwMnAj8qT9lIuIt9rVVSqUBbSId3cm3Az9pOlaw5ElfkENifuiG4vFvkB9vM1j86Ha0KUwQi27bAosQ7ALihZQfqfUhWVEeAJ4PVUjF2wy929e0NUVMosm7CLY6dRYfYBPknYUrCKSi/KCizKYxY9psx5wwA2gZ+HHZKfjR11fFnJnyuaywiWG/p32PGLJcBiLGmIkqYLIYQQQgghhBBCCCGEEEIIIYQQpfP/kltVxixn2akAAAAASUVORK5CYII=`;
