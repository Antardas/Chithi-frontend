import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Button from '~/Components/Button';
import '~/Components/Chat/Window/MessageInput/MessageInput.scss';
import Input from '~/Components/Input';
import { SetState } from '~/types/utils';
import gif from '~/assets/images/gif.png';
import photo from '~/assets/images/photo.png';
import feeling from '~/assets/images/feeling.png';
import loadable from '@loadable/component';
import Giphy from '~/Components/Chat/Giphy';
import ImagePreview from '~/Components/Chat/ImagePreview';
import { ImageUtils } from '~/services/utils/image-utils.service';
import { EmojiClickData } from 'emoji-picker-react';
const EmojiPicker = loadable(() => import('~/Components/Chat/Window/MessageInput/EmojiPicker'), {
  fallback: <p id="loading">Loading...</p>
});
const MessageInput = ({ setChatMessage }: { setChatMessage: (obj: ISendMessageParam) => void }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showGif, setShowGif] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [file, setFile] = useState<string>();
  const [fileBase64, setFileBase64] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setShowEmojiPicker(false);
    setShowGif(false);
    setShowImage(false);
    setFile('');
    setFileBase64('');
    setMessage('');
  };

  const fileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const addToPreview = async (file: File) => {
    const isImageIsValid = ImageUtils.checkFile(file);
    if (!isImageIsValid) {
      return;
    }
    setFile(URL.createObjectURL(file));
    const result = await ImageUtils.readAsBase64(file);
    setFileBase64(result as string);
    setShowGif(false);
    setShowEmojiPicker(false);
    setShowImage(true);
  };

  const handleGiphyClick = (url: string) => {
    setChatMessage({ message: 'Sent A GIF', gifUrl: url, image: '' });
    reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalMessage = message || 'Sent an Image';
    setChatMessage({ message: finalMessage.replace(/ +(?=)/g, ''), gifUrl: '', image: fileBase64 });
    reset();
  };

  const handleImageCLick = () => {
    const finalMessage = message || 'Sent an Image';
    setChatMessage({ message: finalMessage.replace(/ +(?=)/g, ''), gifUrl: '', image: fileBase64 });
    reset();
  };

  const onEmojiClick = useCallback((event: EmojiClickData) => {
    setMessage((prevMessage) => `${prevMessage}${event.emoji}`);
  }, []);

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [setChatMessage]);
  return (
    <div>
      {showEmojiPicker ? (
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          // pickerStyle={{
          //   with: '352px',
          //   height: '447px'
          // }}
        />
      ) : null}
      {showGif ? <Giphy handleGiphyClick={handleGiphyClick} /> : null}
      <div className="chat-inputarea" data-testid="chat-inputarea">
        {showImage && file ? (
          <ImagePreview
            image={file}
            onRemoveImage={() => {
              setFile(undefined);
              setShowImage(false);
              setFileBase64('');
            }}
          />
        ) : null}
        <form onSubmit={handleSubmit}>
          <ul className="chat-list" style={{ borderColor: `${hasFocus ? '#50b5ff' : '#f1f0f0'}` }}>
            <li
              className="chat-list-item"
              onClick={() => {
                fileInputClick();
                setShowGif(false);
                setShowEmojiPicker(false);
              }}
            >
              <Input
                ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                className="file-input"
                placeholder="Select file"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                onChange={(event) => {
                  if (event.target.files?.length) {
                    addToPreview(event.target.files[0]);
                  }
                }}
              />
              <img src={photo} alt="" />
            </li>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowGif(true);
                setShowEmojiPicker(false);
                setShowImage(false);
              }}
            >
              <img src={gif} alt="" />
            </li>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowGif(false);
                setShowImage(false);
                setShowEmojiPicker(!showEmojiPicker);
              }}
            >
              <img src={feeling} alt="" />
            </li>
          </ul>
          <Input
            ref={messageInputRef}
            id="message"
            name="message"
            type="text"
            className="chat-input"
            value={message}
            labelText=""
            placeholder="Enter your message..."
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </form>
        {showImage && !message ? <Button label={<FaPaperPlane />} className="paper" onClick={handleImageCLick} /> : null}
      </div>
    </div>
  );
};

export default MessageInput;

interface ISendMessageParam {
  message: string;
  gifUrl: string;
  image: string;
}
