import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from '~/Components/Input';
import '~/Components/Giphy/Giphy.scss';
import { GiphyUtils } from '~/services/utils/giphy-utils.service';
import { GiphyResponse } from '~/services/api/giphy/giphy.service';
import { RootState, useAppDispatch } from '~/redux/store';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { toggleGifModal } from '~/redux/reducers/modal/modal.reducer';
import { useSelector } from 'react-redux';
import Spinner from '../Spinner';
import useDebounce from '~/hooks/useDebounce';
import useEffectOnce from '~/hooks/useEffectOnce';
const Giphy = () => {
  const { gifModalIsOpen } = useSelector((state: RootState) => state.modal);
  const [gifs, setGifs] = useState<GiphyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debounceValue = useDebounce(searchTerm, 300);

  const selectGif = (gifUrl: string) => {
    dispatch(
      updatePostItem({
        gifUrl: gifUrl,
        image: '',
        video: ''
      })
    );
    dispatch(toggleGifModal(!gifModalIsOpen));
  };

  useEffectOnce(() => {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  });

  useEffect(() => {
    if (debounceValue) {
      GiphyUtils.searchGifs(debounceValue, setGifs, setLoading);
    }
  }, [debounceValue]);

  return (
    <>
      <div className="giphy-container" id="editable" data-testid="giphy-container">
        <div className="giphy-container-picker" style={{ height: '500px' }}>
          <div className="giphy-container-picker-form">
            <FaSearch className="search" />
            <Input
              id="gif"
              name="gif"
              type="text"
              labelText=""
              placeholder="Search Gif"
              className="giphy-container-picker-form-input"
              handleChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? <Spinner /> : null}

          <ul className="giphy-container-picker-list" data-testid="unorderedList">
            {gifs.map((gif, index) => (
              <li className="giphy-container-picker-list-item" data-testid="list-item" key={gif.id} onClick={() => selectGif(gif.images.original.url)}>
                <img style={{ width: '470px' }} src={`${gif.images.original.url}`} alt="" />
              </li>
            ))}
          </ul>

          {!gifs && !loading && (
            <ul className="giphy-container-picker-list">
              <li className="giphy-container-picker-list-no-item">No GIF found</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Giphy;
