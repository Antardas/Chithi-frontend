import { createSlice } from '@reduxjs/toolkit';
import { IReactionPost } from '~/types/reaction';
interface IInitialState {
  reactions: IReactionPost[];
}
const initialState: IInitialState = {
  reactions: []
};

interface IAction {
  payload: unknown;
  type: string;
}

interface IAddReactionsAction extends IAction {
  payload: IReactionPost[];
}

const userReactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    addReactions: (state, action: IAddReactionsAction) => {
      state.reactions = action.payload;
    }
  }
});
export const { addReactions } = userReactionsSlice.actions;
export default userReactionsSlice.reducer;
