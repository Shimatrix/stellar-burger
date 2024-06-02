import { configureStore } from '@reduxjs/toolkit';
import { ordersReducer, feedThunk, ordersThunk, orderNumberThunk, orderBurgerThunk, close } from '../slices/ordersSlice';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

const mockOrderData: TOrder = { _id: '1', status: 'done', name: 'Burger', createdAt: '2021-01-01', updatedAt: '2021-01-01', number: 1, ingredients: ['1', '2'] };
const mockOrdersData: TOrder[] = [mockOrderData];

describe('ordersSlice', () => {
  const initialState = {
    orders: [],
    orderRequest: false,
    orderModalData: null,
    error: null,
    loading: false
  };

  const createTestStore = () => configureStore({
    reducer: {
      orders: ordersReducer
    }
  });

  test('должен вернуть начальное состояние', () => {
    const store = createTestStore();
    const state = store.getState().orders;
    expect(state).toEqual(initialState);
  });

  test('должен обработать feedThunk.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: feedThunk.pending.type });
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('должен обработать feedThunk.fulfilled', async () => {
    const store = createTestStore();
    (getFeedsApi as jest.Mock).mockResolvedValueOnce({ orders: mockOrdersData });

    await store.dispatch(feedThunk() as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orders: mockOrdersData,
      loading: false,
      error: null
    });
  });

  test('должен обработать feedThunk.rejected', async () => {
    const store = createTestStore();
    const errorMessage = 'Ошибка загрузки';
    (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(feedThunk() as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  test('должен обработать ordersThunk.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: ordersThunk.pending.type });
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      loading: true,
      error: null
    });
  });

  test('должен обработать ordersThunk.fulfilled', async () => {
    const store = createTestStore();
    (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockOrdersData);

    await store.dispatch(ordersThunk() as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orders: mockOrdersData,
      orderRequest: false,
      loading: false,
      error: null
    });
  });

  test('должен обработать ordersThunk.rejected', async () => {
    const store = createTestStore();
    const errorMessage = 'Ошибка загрузки';
    (getOrdersApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(ordersThunk() as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      loading: false,
      error: errorMessage
    });
  });

  test('должен обработать orderNumberThunk.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: orderNumberThunk.pending.type });
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('должен обработать orderNumberThunk.fulfilled', async () => {
    const store = createTestStore();
    (getOrderByNumberApi as jest.Mock).mockResolvedValueOnce({ orders: [mockOrderData] });

    await store.dispatch(orderNumberThunk(1) as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orderModalData: mockOrderData,
      loading: false,
      error: null
    });
  });

  test('должен обработать orderNumberThunk.rejected', async () => {
    const store = createTestStore();
    const errorMessage = 'Ошибка загрузки';
    (getOrderByNumberApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(orderNumberThunk(1) as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  test('должен обработать orderBurgerThunk.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: orderBurgerThunk.pending.type });
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      loading: true,
      error: null
    });
  });

  test('должен обработать orderBurgerThunk.fulfilled', async () => {
    const store = createTestStore();
    (orderBurgerApi as jest.Mock).mockResolvedValueOnce({ order: mockOrderData });

    await store.dispatch(orderBurgerThunk(['1', '2']) as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      orderModalData: mockOrderData,
      loading: false,
      error: null
    });
  });

  test('должен обработать orderBurgerThunk.rejected', async () => {
    const store = createTestStore();
    const errorMessage = 'Ошибка загрузки';
    (orderBurgerApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(orderBurgerThunk(['1', '2']) as any);
    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      loading: false,
      error: errorMessage
    });
  });

  test('должен обработать действие close', () => {
    const store = createTestStore();
    store.dispatch(close());
    const state = store.getState().orders;
    expect(state).toEqual(initialState);
  });
});
