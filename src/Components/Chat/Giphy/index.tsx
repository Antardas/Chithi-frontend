import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Input from '~/Components/Input';
import Spinner from '~/Components/Spinner';
import { GiphyResponse } from '~/services/api/giphy/giphy.service';
import { GiphyUtils } from '~/services/utils/giphy-utils.service';
import '~/Components/Chat/Giphy/Giphy.scss'
const Giphy = ({ handleGiphyClick }: Props) => {
  const [gifs, setGifs] = useState<GiphyResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  }, []);
  return (
    <div className="giphy-search-container" data-testid="giphy-container">
      <div className="giphy-search-input">
        <FaSearch className="search" />
        <Input
          id="gif"
          name="gif"
          type="text"
          labelText=""
          placeholder="Search Gif"
          className="search-input"
          handleChange={(e) => GiphyUtils.searchGifs(e.target.value, setGifs, setLoading)}
        />
      </div>
      {loading && <Spinner />}
      <ul className="search-results">
        {gifs.map((gif) => (
          <li className="gif-result" data-testid="list-item" key={gif.images.original.url} onClick={() => handleGiphyClick(gif.images.original.url)}>
            <img src={`${gif.images.original.url}`} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Giphy;
interface Props {
  handleGiphyClick: (url: string) => void;
}
