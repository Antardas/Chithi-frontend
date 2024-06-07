import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { AppDispatch, useAppDispatch } from '~/redux/store';
import { IPost } from '~/types/post';
import { SetState } from '~/types/utils';
export class ImageUtils {
  private static validateFile(file: File, type: 'image' | 'video'): boolean {
    console.log(file.type);

    if (type === 'image') {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      return file && validTypes.indexOf(file.type) > -1;
    } else {
      const validTypes = ['video/m4v', 'video/avi', 'video/mp4', 'video/mpg', 'video/webm'];
      return file && validTypes.indexOf(file.type) > -1;
    }
  }

  private static checkFileSize(file: File, type: 'image' | 'video'): string {
    let fileError = '';
    const isValid = ImageUtils.validateFile(file, type);

    if (!isValid) {
      fileError += `${file.name} not accepted.\n`;
    }
    // 50MB
    if (file.size > 52_428_800) {
      fileError += 'file size cannot exceed 50MB.\n';
    }

    return fileError;
  }

  static checkFile(file: File, type: 'image' | 'video') {
    const hasError = ImageUtils.checkFileSize(file, type);
    if (hasError) {
      const errorMessages = hasError.split('\n').filter(Boolean);
      errorMessages.forEach((item) => window.alert(item));
      return false;
    }
    return true;
  }

  static addFileToRedux(
    event: React.ChangeEvent<HTMLInputElement>,
    post: string,
    setSelectedFile: SetState<File | undefined>,
    dispatch: AppDispatch,
    type: 'image' | 'video'
  ) {
    console.log(type, 'type----');

    const file: File | null = event.target.files?.length ? event.target.files[0] : null;
    if (!file) {
      window.alert('Select a File');
      return;
    }

    if (!ImageUtils.checkFile(file, type)) {
      throw new Error('file is not valid');
    }

    setSelectedFile(file);
    dispatch(
      updatePostItem({
        image: type === 'image' ? URL.createObjectURL(file) : '',
        gifUrl: '',
        imgId: '',
        imgVersion: '',
        post,
        video: type === 'video' ? URL.createObjectURL(file) : '',
        videoId: '',
        videoVersion: ''
      })
    );
  }

  static readAsBase64(file: File): Promise<unknown> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', (event) => {
        reject(event);
      });

      reader.readAsDataURL(file);
    });

    return fileValue;
  }

  static renameImage(file: File) {
    const fileName = file.name.split('.').slice(0, -1).join('.');
    const blob = file.slice(0, file.size, '/image/png');
    const newFile = new File([blob], `${fileName}.png`, { type: '/image/png' });
    return newFile;
  }
}
