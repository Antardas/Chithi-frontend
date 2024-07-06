export interface IAddImage {
  message: string;
  data: string;
}

export interface IImageData {
  userId: string;
  bgImageVersion: string;
  bgImageId: string;
  imgId: string;
  imgVersion: string;
  createdAt: Date;
  _id: string;
}

export interface IGetImages {
  message: string;
  data: IImageData[];
}

export interface IUpdateOrAddBackgroundImage {
  message: string;
  data: {
    bgImageId: string;
    bgImageVersion: string;
  };
}
