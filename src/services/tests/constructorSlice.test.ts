import {
  constructorReducer,
  addItems,
  removeItems,
  clearOrder,
  moveItems
} from '../slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [] as TConstructorIngredient[]
  };

  test('должен вернуть начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('должен обрабатывать добавление булочки', () => {
    const bun: TConstructorIngredient = {
      _id: '1',
      name: 'Bun',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 2,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid'
    };
    const action = addItems(bun);
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      bun: { ...bun, id: 'test-uuid' },
      ingredients: []
    });
  });

  test('должен обрабатывать добавление ингредиента', () => {
    const ingredient: TConstructorIngredient = {
      _id: '2',
      name: 'Ingredient',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 3,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid'
    };
    const action = addItems(ingredient);
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      bun: null,
      ingredients: [{ ...ingredient, id: 'test-uuid' }]
    });
  });

  test('должен обрабатывать удаление ингредиента', () => {
    const ingredient: TConstructorIngredient = {
      _id: '2',
      name: 'Ingredient',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 3,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid'
    };
    const stateWithIngredient = {
      bun: null,
      ingredients: [ingredient]
    };
    const action = removeItems({ _id: '2', type: 'main' });
    const state = constructorReducer(stateWithIngredient, action);
    expect(state).toEqual(initialState);
  });

  test('должен обрабатывать очистку заказа', () => {
    const stateWithOrder = {
      bun: {
        _id: '1',
        name: 'Bun',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 100,
        price: 2,
        image: 'image',
        image_large: 'image_large',
        image_mobile: 'image_mobile',
        id: 'test-uuid'
      },
      ingredients: [
        {
          _id: '2',
          name: 'Ingredient',
          type: 'main',
          proteins: 10,
          fat: 10,
          carbohydrates: 10,
          calories: 100,
          price: 3,
          image: 'image',
          image_large: 'image_large',
          image_mobile: 'image_mobile',
          id: 'test-uuid'
        }
      ]
    };
    const action = clearOrder();
    const state = constructorReducer(stateWithOrder, action);
    expect(state).toEqual(initialState);
  });

  test('должен обрабатывать перемещение ингредиентов', () => {
    const ingredient1: TConstructorIngredient = {
      _id: '2',
      name: 'Ingredient1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 3,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid1'
    };
    const ingredient2: TConstructorIngredient = {
      _id: '3',
      name: 'Ingredient2',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 4,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid2'
    };
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const action = moveItems({ index: 0, direction: 'down' });
    const state = constructorReducer(stateWithIngredients, action);
    expect(state.ingredients).toEqual([ingredient2, ingredient1]);
  });

  test('не должен перемещать ингредиенты, если направление выходит за границы', () => {
    const ingredient1: TConstructorIngredient = {
      _id: '2',
      name: 'Ingredient1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 3,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid1'
    };
    const ingredient2: TConstructorIngredient = {
      _id: '3',
      name: 'Ingredient2',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 4,
      image: 'image',
      image_large: 'image_large',
      image_mobile: 'image_mobile',
      id: 'test-uuid2'
    };
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const actionUp = moveItems({ index: 0, direction: 'up' });
    const stateUp = constructorReducer(stateWithIngredients, actionUp);
    expect(stateUp.ingredients).toEqual([ingredient1, ingredient2]);

    const actionDown = moveItems({ index: 1, direction: 'down' });
    const stateDown = constructorReducer(stateWithIngredients, actionDown);
    expect(stateDown.ingredients).toEqual([ingredient1, ingredient2]);
  });
});
