import React from 'react';
import { INotification } from '~/types/notification';
// export interface ISettingsDropdown extends INotification {
//   topText: string;
//   subText: string;
// }
export type ISettingsDropdown = Partial<INotification> & {
  topText: string;
  subText: string;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ITabItems {
  key: string;
  show: boolean;
  icon: JSX.Element;
}
