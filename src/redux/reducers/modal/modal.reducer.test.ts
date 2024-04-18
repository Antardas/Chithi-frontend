import reducer, {
  addPostFeeling,
  closeModal,
  openModal,
  toggleDeleteDialog,
  toggleFeelingModal,
  toggleGifModal,
  toggleImageModal,
  toggleCommentModal,
  toggleReactionModal
} from '~/redux/reducers/modal/modal.reducer';
import { describe, expect, it, beforeEach } from 'vitest';
import { UnknownAction } from '@reduxjs/toolkit';
import { IModalInterface } from '~/types/modal';
const initialState: IModalInterface = {
  type: '',
  isOpen: false,
  feeling: { image: '', index: -1, name: '' },
  image: '',
  data: null,
  feelingsIsOpen: false,
  openFileDialog: false,
  gifModalIsOpen: false,
  reactionModalIsOpen: false,
  commentsModalIsOpen: false,
  deleteDialogIsOpen: false,
  showCommentBox: false
};

const modalData: IModalInterface = {
  type: 'add',
  isOpen: true,
  feeling: {
    image: '',
    index: -1,
    name: 'happy'
  },
  image: 'https://place-hold.it',
  data: { username: 'Matt' },
  feelingsIsOpen: true,
  openFileDialog: true,
  gifModalIsOpen: true,
  reactionModalIsOpen: true,
  commentsModalIsOpen: true,
  deleteDialogIsOpen: true,
  showCommentBox: true
};

describe('modal reducer', () => {
  beforeEach(() => {
    initialState.type = '';
    initialState.isOpen = false;
    initialState.feeling = { image: '', index: -1, name: '' };
    initialState.image = '';
    initialState.data = null;
    initialState.feelingsIsOpen = false;
    initialState.openFileDialog = false;
    initialState.gifModalIsOpen = false;
    initialState.reactionModalIsOpen = false;
    initialState.commentsModalIsOpen = false;
    initialState.deleteDialogIsOpen = false;
    initialState.showCommentBox = false;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as UnknownAction)).toEqual(initialState);
  });

  it('should open modal', () => {
    expect(reducer(initialState, openModal({ type: 'add', data: 'This is a message' }))).toEqual({
      type: 'add',
      isOpen: true,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: 'This is a message',
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should close modal', () => {
    expect(reducer(modalData, closeModal())).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should add post feeling', () => {
    expect(
      reducer(
        initialState,
        addPostFeeling({
          image: '',
          index: -1,
          name: 'happy'
        })
      )
    ).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: 'happy'
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should toggleImageModal', () => {
    expect(reducer(initialState, toggleImageModal(true))).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: true,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should toggleFeelingModal', () => {
    expect(reducer(initialState, toggleFeelingModal(true))).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: true,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should toggleGifModal', () => {
    expect(reducer(initialState, toggleGifModal(true))).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: true,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should toggleReactionsModal', () => {
    expect(reducer(initialState, toggleReactionModal(true))).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: true,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should toggleCommentsModal', () => {
    expect(reducer(initialState, toggleCommentModal(true))).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: true,
      deleteDialogIsOpen: false,
      showCommentBox: false
    });
  });

  it('should toggleDeleteDialog', () => {
    expect(reducer(initialState, toggleDeleteDialog({data:null, toggle:true}))).toEqual({
      type: '',
      isOpen: false,
      feeling: {
        image: '',
        index: -1,
        name: ''
      },
      image: '',
      data: null,
      feelingsIsOpen: false,
      openFileDialog: false,
      gifModalIsOpen: false,
      reactionModalIsOpen: false,
      commentsModalIsOpen: false,
      deleteDialogIsOpen: true,
      showCommentBox: false
    });
  });
});
