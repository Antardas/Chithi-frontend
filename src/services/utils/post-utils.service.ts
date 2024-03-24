import { IPostData } from '~/types/post';

export class PostUtils {
  static selectBackgroundColor({ bgColor, postData, setTextAreaBackground, setPostData, setDisable }: ISelectBackgroundColorParams) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
    setDisable(false);
  }
}

interface ISelectBackgroundColorParams {
  bgColor: string;
  postData: IPostData;
  setTextAreaBackground: SetState<string>;
  setPostData: SetState<IPostData>;
  setDisable: SetState<boolean>;
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
