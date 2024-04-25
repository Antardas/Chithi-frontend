import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { AppDispatch, useAppDispatch } from '~/redux/store';
import { IPost } from '~/types/post';
import { SetState } from '~/types/utils';
export class ImageUtils {
  private static validateFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return file && validTypes.indexOf(file.type) > -1;
  }

  private static checkFileSize(file: File): string {
    let fileError = '';
    const isValid = ImageUtils.validateFile(file);

    if (!isValid) {
      fileError += `${file.name} not accepted.\n`;
    }
    // 50MB
    if (file.size > 52_428_800) {
      fileError += 'file size cannot exceed 50MB.\n';
    }

    return fileError;
  }

  static checkFile(file: File) {
    const hasError = ImageUtils.checkFileSize(file);
    if (hasError) {
      const errorMessages = hasError.split('\n').filter(Boolean);
      errorMessages.forEach((item) => window.alert(item));
    }
  }

  static addFileToRedux(
    event: React.ChangeEvent<HTMLInputElement>,
    post: string,
    setSelectedPostImage: SetState<File | undefined>,
    dispatch: AppDispatch
  ) {
    const file: File | null = event.target.files?.length ? event.target.files[0] : null;
    if (!file) {
      window.alert('Select a File');
      return;
    }

    ImageUtils.checkFile(file);

    setSelectedPostImage(file);
    dispatch(
      updatePostItem({
        image: URL.createObjectURL(file),
        gifUrl: '',
        imgId: '',
        imgVersion: '',
        post
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
}
