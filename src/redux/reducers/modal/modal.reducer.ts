import { Slice, createSlice } from '@reduxjs/toolkit';
import { IModalInterface } from '~/types/modal';

const initialState: IModalInterface = {
  type: '',
  isOpen: false,
  feeling: {
    name: ''
  },
  image: '',
  data: null,
  feelingsIsOpen: false,
  openFileDialog: false,
  reactionModalIsOpen: false,
  gifModalIsOpen: false,
  commentsModalIsOpen: false,
  deleteDialogIsOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.data = data;
    },

    closeModal: (state) => {
      state.type = '';
      state.isOpen = false;
      state.feeling = {
        name: '',
        image: ''
      };
      state.image = '';
      state.data = null;
      state.feelingsIsOpen = false;
      state.openFileDialog = false;
      state.reactionModalIsOpen = false;
      state.gifModalIsOpen = false;
      state.commentsModalIsOpen = false;
      state.deleteDialogIsOpen = false;
    },

    addPostFeelings: (state, action) => {
      const { feeling } = action.payload;
      state.feeling = feeling;
    },
    toggleImageModal: (state, action) => {
      state.feelingsIsOpen = action.payload;
    },
    toggleGifModal: (state, action) => {
      state.gifModalIsOpen = action.payload;
    },
    toggleReactionModal: (state, action) => {
      state.reactionModalIsOpen = action.payload;
    },
    toggleCommentModal: (state, action) => {
      state.commentsModalIsOpen = action.payload;
    },
    toggleDeleteDialog: (state, action) => {
      state.deleteDialogIsOpen = action.payload;
    }
  }
});

export const {
  addPostFeelings,
  closeModal,
  openModal,
  toggleCommentModal,
  toggleDeleteDialog,
  toggleGifModal,
  toggleImageModal,
  toggleReactionModal
} = modalSlice.actions;

export default modalSlice.reducer;
