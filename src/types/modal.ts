import { IFeeling } from "~/services/utils/static.data";

export interface IModalInterface {
  type: string;
  isOpen: boolean;
  feeling: IFeeling
  image: string;
  data: object | null;
  feelingsIsOpen: boolean;
  openFileDialog: boolean;
  reactionModalIsOpen: boolean;
  commentsModalIsOpen: boolean;
  deleteDialogIsOpen: boolean;
  gifModalIsOpen: boolean;
}
