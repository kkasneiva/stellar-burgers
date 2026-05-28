import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index <= 0) return;

      const currentIngredient = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index - 1];
      state.ingredients[index - 1] = currentIngredient;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index >= state.ingredients.length - 1) return;

      const currentIngredient = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index + 1];
      state.ingredients[index + 1] = currentIngredient;
    },
    clearConstructor: () => initialState
  },
  selectors: {
    selectConstructorItems: (state) => state,
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const {
  selectConstructorItems,
  selectConstructorBun,
  selectConstructorIngredients
} = constructorSlice.selectors;

export default constructorSlice.reducer;
