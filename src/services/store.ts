import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/IngredientsSlice';
import { feedReducer } from './slices/feedSlice';
import { userReducer } from './slices/userSlice';
import { ordersReducer } from './slices/ordersSlice';
import { constructorReducer } from './slices/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  user: userReducer,
  orders: ordersReducer,
  constructorBurger: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
