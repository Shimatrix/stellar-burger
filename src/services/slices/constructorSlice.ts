import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addItems: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeItems: (state, action) => {
      if (action.payload.type !== 'bun') {
        const idIngridient = action.payload._id;
        const index = state.ingredients.findIndex(
          (item) => item._id === idIngridient
        );
        state.ingredients.splice(index, 1);
      }
    },
    clearOrder: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveItems: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const ingredients = [...state.ingredients];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= ingredients.length) {
        return;
      }

      [ingredients[index], ingredients[newIndex]] = [
        ingredients[newIndex],
        ingredients[index]
      ];
      state.ingredients = ingredients;
    }
  }
});

export const constructorReducer = constructorSlice.reducer;
export const { addItems, removeItems, clearOrder, moveItems } =
  constructorSlice.actions;
