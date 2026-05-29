import { TConstructorIngredient, TIngredient } from '@utils-types';
import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './constructorSlice';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const mockConstructorMain: TConstructorIngredient = {
  ...mockMain,
  id: 'main-id'
};

const mockConstructorSauce: TConstructorIngredient = {
  ...mockSauce,
  id: 'sauce-id'
};

describe('constructorSlice', () => {
  test('adds bun ingredient to constructor', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state.bun).toEqual({
      ...mockBun,
      id: 'test-uuid'
    });
    expect(state.ingredients).toEqual([]);
  });

  test('adds filling ingredient to constructor', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([
      {
        ...mockMain,
        id: 'test-uuid'
      }
    ]);
  });

  test('removes ingredient from constructor by id', () => {
    const initialState = {
      bun: null,
      ingredients: [mockConstructorMain, mockConstructorSauce]
    };

    const state = constructorReducer(initialState, removeIngredient('main-id'));

    expect(state.ingredients).toEqual([mockConstructorSauce]);
  });

  test('moves filling ingredient up', () => {
    const initialState = {
      bun: null,
      ingredients: [mockConstructorMain, mockConstructorSauce]
    };

    const state = constructorReducer(initialState, moveIngredientUp(1));

    expect(state.ingredients).toEqual([
      mockConstructorSauce,
      mockConstructorMain
    ]);
  });

  test('moves filling ingredient down', () => {
    const initialState = {
      bun: null,
      ingredients: [mockConstructorMain, mockConstructorSauce]
    };

    const state = constructorReducer(initialState, moveIngredientDown(0));

    expect(state.ingredients).toEqual([
      mockConstructorSauce,
      mockConstructorMain
    ]);
  });

  test('clears constructor', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockConstructorMain, mockConstructorSauce]
    };

    const state = constructorReducer(initialState, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
