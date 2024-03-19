import React from 'react';
import '~/Components/Avatar/Avatar.scss';

export interface AvatarProps {
  avatarSrc: string;
  name: string;
  bgColor?: string;
  textColor?: string;
  size: number;
  round?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ avatarSrc, name='', bgColor = '#f33e58', textColor, size, round = true }: AvatarProps) => {
  const textSizeRatio: number = 1.7;
  const fontSize = Math.floor(size / textSizeRatio);

  const firstNameCharacter = name.charAt(0);

  return (
    <>
      {!avatarSrc ? (
        <div
          data-testid="avatar-container"
          className="avatar-container"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${round ? '50%' : ''}`,
            backgroundColor: bgColor,
            display: 'flex'
          }}
        >
          {name ? (
            <div
              data-testid="avatar-name"
              className="avatar-container"
              style={{
                color: textColor,
                fontSize,
                margin: 'auto',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {firstNameCharacter}
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <img
          src={avatarSrc}
          alt="Avatar"
          className="avatar-content avatar-container"
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${round ? '50%' : ''}` }}
        />
      )}
    </>
  );
};

export default Avatar;
