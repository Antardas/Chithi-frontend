import React from 'react';
import Picker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
const EmojiPicker = React.memo(({ onEmojiClick, pickerStyle }: EmojiPickerProps) => {

  return (
    <div className="emoji-picker" data-testid="emoji-picker">
      <Picker
        onEmojiClick={onEmojiClick}
        emojiStyle={EmojiStyle.NATIVE}
        style={{
          width: '352px',
          height: '447px'
        }}
      />
    </div>
  );
});

interface EmojiPickerProps {
  onEmojiClick: (event: EmojiClickData) => void;
  pickerStyle: object;
}

export default EmojiPicker;
