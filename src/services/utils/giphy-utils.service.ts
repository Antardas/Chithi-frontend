import { SetState } from '~/types/utils';
import { GiphyResponse, giphyService } from '~/services/api/giphy/giphy.service';

export class GiphyUtils {
  static async getTrendingGifs(setGifs: SetState<GiphyResponse[]>, setLoading: SetState<boolean>) {
    setLoading(true);
    try {
      const response = await giphyService.trending();
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  static async searchGifs(query: string, setGifs: SetState<GiphyResponse[]>, setLoading: SetState<boolean>) {
    if (query.length <= 1) {
      GiphyUtils.getTrendingGifs(setGifs, setLoading);
      return;
    }
    setLoading(true);
    try {
      const response = await giphyService.search(query);
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
}
