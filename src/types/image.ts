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
}

export interface IGetImages {
  message: string;
  data: IImageData[];
}
