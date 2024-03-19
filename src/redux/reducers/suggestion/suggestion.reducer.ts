import { createSlice } from '@reduxjs/toolkit';
import { getSuggestions } from '~/redux/api/suggestion';
import { ISuggestionUser, IUser } from '~/types/user';

const initialState: ISuggestionUser = {
  users: [],
  isLoading: false
};

const suggestionSlice = createSlice({
  name: 'suggestion',
  initialState,
  reducers: {
    addToSuggestion: (state, action) => {
      const { users, isLoading } = action.payload;
      state.users = [...users];
      state.isLoading = isLoading;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSuggestions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload?.data as IUser[];
    });
    builder.addCase(getSuggestions.rejected, (state) => {
      state.isLoading = false;
    });
  }
});
export const { addToSuggestion } = suggestionSlice.actions;
export default suggestionSlice.reducer;
