import { rootReducer } from './store';

describe('rootReducer', () => {
  test('returns correct initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isFeedLoading: false,
        error: null
      },
      order: {
        currentOrder: null,
        orderModalData: null,
        orderRequest: false,
        isOrderInfoLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isUserLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isProfileOrdersLoading: false,
        error: null
      }
    });
  });
});
