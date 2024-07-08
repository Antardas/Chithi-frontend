import { AxiosResponse } from 'axios';
import axiosInstance from '~/services/axios';
import { OnlyMessageResponse } from '~/types/axios';
import { IAddImage, IGetImages, IImageData, IUpdateOrAddBackgroundImage } from '~/types/image';

class ImageService {
  async addUserProfileImage(imageBase64Str: string): Promise<AxiosResponse<IAddImage>> {
    const response = await axiosInstance.post<IAddImage>('/images/profile', {
      image: imageBase64Str
    });
    return response;
  }
  async addUserBackgroundImage(imageBase64Str: string): Promise<AxiosResponse<IUpdateOrAddBackgroundImage>> {
    const response = await axiosInstance.post<IUpdateOrAddBackgroundImage>('/images/background', {
      image: imageBase64Str
    });
    return response;
  }
  async getUserImages(userId: string): Promise<AxiosResponse<IGetImages>> {
    const response = await axiosInstance.get<IGetImages>(`/images/${userId}`);
    return response;
  }
  async deleteUserProfileImage(imageId: string): Promise<AxiosResponse<OnlyMessageResponse>> {
    const response = await axiosInstance.delete<OnlyMessageResponse>(`/images/profile/${imageId}`);
    return response;
  }
  async deleteUserBackgroundImage(imageId: string): Promise<AxiosResponse<OnlyMessageResponse>> {
    const response = await axiosInstance.delete<OnlyMessageResponse>(`/images/background/${imageId}`);
    return response;
  }
}

export const imageService: ImageService = new ImageService();
