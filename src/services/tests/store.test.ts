import { configureStore } from '@reduxjs/toolkit';

import store, { rootReducer } from '../store';

describe('Redux Store', () => {
  test('в rootReducer должны быть правильные редьюсеры', () => {
    const rootState = rootReducer(undefined, { type: 'TEST_ACTION' });
    
    expect(rootState).toHaveProperty('ingredients');
    expect(rootState).toHaveProperty('feed');
    expect(rootState).toHaveProperty('user');
    expect(rootState).toHaveProperty('orders');
    expect(rootState).toHaveProperty('constructorBurger');
  });

  test('настроить стор с помощью rootReducer', () => {
    const testStore = configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production'
    });

    expect(testStore.getState()).toHaveProperty('ingredients');
    expect(testStore.getState()).toHaveProperty('feed');
    expect(testStore.getState()).toHaveProperty('user');
    expect(testStore.getState()).toHaveProperty('orders');
    expect(testStore.getState()).toHaveProperty('constructorBurger');
  });

  test('должен корректно возвращать исходное состояние', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('constructorBurger');
  });
});
