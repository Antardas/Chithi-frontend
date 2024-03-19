import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { userService } from '~/services/api/user/user.service';
import { SuggestionResponse } from '~/types/axios';

const getSuggestions = createAsyncThunk('user/getSuggestions', async (/* name: string, { dispatch } */) => {
  try {
    const response: AxiosResponse<SuggestionResponse> = await userService.getUserSuggestion();

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export { getSuggestions };
