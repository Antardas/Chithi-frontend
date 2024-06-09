import { createSlice } from '@reduxjs/toolkit';
import { IModalInterface } from '~/types/modal';

const initialState: IModalInterface = {
  type: '',
  isOpen: false,
  feeling: {
    name: '',
    image: '',
    index: -1
  },
  image: '',
  data: null,
  feelingsIsOpen: false,
  openFileDialog: false, // TODO: change the file to Image
  reactionModalIsOpen: false,
  gifModalIsOpen: false,
	videoModalIsOpen: false,
  commentsModalIsOpen: false,
  deleteDialogIsOpen: false,
  showCommentBox: false
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
        image: '',
        index: -1
      };
      state.image = '';
      state.data = null;
      state.feelingsIsOpen = false;
      state.openFileDialog = false; // TODO: change the file to Image
      state.reactionModalIsOpen = false;
      state.gifModalIsOpen = false;
      state.commentsModalIsOpen = false;
      state.deleteDialogIsOpen = false;
			state.showCommentBox = false;
			state.videoModalIsOpen = false
    },

    addPostFeeling: (state, action) => {
      // const { feeling } = action.payload;
      state.feeling = action.payload;
    },
    toggleFeelingModal: (state, action) => {
      state.feelingsIsOpen = action.payload;
    },
    toggleImageModal: (state, action) => {
      state.openFileDialog = action.payload; // TODO: change the file to Image
    },
    toggleVideoModal: (state, action) => {
      state.videoModalIsOpen = action.payload;
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
      const { data, toggle } = action.payload;

      state.deleteDialogIsOpen = toggle;
      state.data = data;
    },
    toggleCommentBox: (state, action) => {
      state.showCommentBox = action.payload;
    }
  }
});

export const {
  addPostFeeling,
  closeModal,
  openModal,
  toggleCommentModal,
  toggleDeleteDialog,
  toggleGifModal,
  toggleFeelingModal,
  toggleReactionModal,
  toggleImageModal,
	toggleCommentBox,
	toggleVideoModal
} = modalSlice.actions;

export default modalSlice.reducer;
