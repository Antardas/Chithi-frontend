import { INotification } from '~/types/notification';
// export interface ISettingsDropdown extends INotification {
//   topText: string;
//   subText: string;
// }
export type ISettingsDropdown = Partial<INotification> & {
  topText: string;
  subText: string;
};
