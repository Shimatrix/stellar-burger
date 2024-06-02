import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, feedThunk } from '../slices/feedSlice';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

const mockFeedData: TOrdersData = {
  orders: [
    { _id: '1', status: 'done', name: 'Burger', createdAt: '2021-01-01', updatedAt: '2021-01-01', number: 1, ingredients: ['1', '2'] }
  ],
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  const initialState = {
    feed: null,
    loading: false,
    error: null
  };

  const createTestStore = () => configureStore({
    reducer: {
      feed: feedReducer
    }
  });

  test('должен вернуть начальное состояние', () => {
    const store = createTestStore();
    const state = store.getState().feed;
    expect(state).toEqual(initialState);
  });

  test('должен обработать feedThunk.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: feedThunk.pending.type });
    const state = store.getState().feed;
    expect(state).toEqual({
      feed: null,
      loading: true,
      error: null
    });
  });

  test('должен обработать feedThunk.fulfilled', async () => {
    const store = createTestStore();
    (getFeedsApi as jest.Mock).mockResolvedValueOnce(mockFeedData);

    await store.dispatch(feedThunk());
    const state = store.getState().feed;
    expect(state).toEqual({
      feed: mockFeedData,
      loading: false,
      error: null
    });
  });

  test('должен обработать feedThunk.rejected', async () => {
    const store = createTestStore();
    const errorMessage = 'Ошибка загрузки';
    (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(feedThunk());
    const state = store.getState().feed;
    expect(state).toEqual({
      feed: null,
      loading: false,
      error: errorMessage
    });
  });
});
