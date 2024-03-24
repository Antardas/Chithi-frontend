export interface IModalInterface {
  type: string;
  isOpen: boolean;
  feeling: {
    name?: string;
    image?: string;
  };
  image: string;
  data: object | null;
  feelingsIsOpen: boolean;
  openFileDialog: boolean;
  reactionModalIsOpen: boolean;
  commentsModalIsOpen: boolean;
  deleteDialogIsOpen: boolean;
  gifModalIsOpen: boolean;
}
