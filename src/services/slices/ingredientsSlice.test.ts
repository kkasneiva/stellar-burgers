import { TIngredient } from '@utils-types';
import ingredientsReducer, { getIngredients } from './ingredientsSlice';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice', () => {
  test('sets loading state when ingredients request is pending', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isIngredientsLoading: true,
      error: null
    });
  });

  test('saves ingredients and disables loading when request is fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isIngredientsLoading: false,
      error: null
    });
  });

  test('saves error and disables loading when request is rejected', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.rejected(new Error('Request failed'), '', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
