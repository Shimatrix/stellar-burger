import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientsReducer,
  ingredientsThunk,
  initialState
} from '../slices/IngredientsSlice';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

const mockIngredientsData: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 50,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  },
  {
    _id: '2',
    name: 'Main',
    type: 'main',
    proteins: 30,
    fat: 20,
    carbohydrates: 10,
    calories: 300,
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  },
  {
    _id: '3',
    name: 'Sauce',
    type: 'sauce',
    proteins: 5,
    fat: 2,
    carbohydrates: 5,
    calories: 50,
    price: 20,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  }
];

describe('ingredientsSlice', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });

  test('должен вернуть начальное состояние', () => {
    const store = createTestStore();
    const state = store.getState().ingredients;
    expect(state).toEqual(initialState);
  });

  test('должен обработать ingredientsThunk.pending', () => {
    const store = createTestStore();
    store.dispatch({ type: ingredientsThunk.pending.type });
    const state = store.getState().ingredients;
    expect(state).toEqual({
      buns: [],
      mains: [],
      sauces: [],
      loading: true,
      error: null
    });
  });

  test('должен обработать ingredientsThunk.fulfilled', async () => {
    const store = createTestStore();
    (getIngredientsApi as jest.Mock).mockResolvedValueOnce(mockIngredientsData);

    await store.dispatch(ingredientsThunk() as any);
    const state = store.getState().ingredients;
    expect(state).toEqual({
      buns: mockIngredientsData,
      mains: mockIngredientsData,
      sauces: mockIngredientsData,
      loading: false,
      error: null
    });
  });

  test('должен обработать ingredientsThunk.rejected', async () => {
    const store = createTestStore();
    const errorMessage = 'Ошибка загрузки';
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await store.dispatch(ingredientsThunk() as any);
    const state = store.getState().ingredients;
    expect(state).toEqual({
      buns: [],
      mains: [],
      sauces: [],
      loading: false,
      error: errorMessage
    });
  });
});
