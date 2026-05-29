import { AnyAction } from '@reduxjs/toolkit';

import { rootReducer } from './store';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

describe('rootReducer', () => {
  test('returns correct initial state for unknown action', () => {
    const unknownAction: AnyAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      profileOrders: profileOrdersReducer(undefined, unknownAction)
    });
  });
});
