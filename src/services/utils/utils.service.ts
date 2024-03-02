import { DefaultAvatarImageDataUrl, avatarColors } from './static.data';

export class Utils {
  static avatarColor() {
    const colorsIndex = Math.floor(Math.random() * avatarColors.length);
    const color: string = avatarColors[colorsIndex];
    return color;
  }

  static generateAvatar(text: string, background: string, foreground: string = 'white'): string {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = background;
      context?.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the text
      context.font = 'normal 80px sans-serif';
      context.fillStyle = foreground;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      return canvas.toDataURL('image/png');
    } else {
      return DefaultAvatarImageDataUrl;
    }
  }
}
