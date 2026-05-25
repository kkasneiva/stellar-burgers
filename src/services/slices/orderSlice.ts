import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isOrderInfoLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  orderModalData: null,
  orderRequest: false,
  isOrderInfoLoading: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);

    return data.orders[0];
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);

    return {
      ...data.order,
      ingredients
    };
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsOrderInfoLoading: (state) => state.isOrderInfoLoading,
    selectOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrderInfoLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrderInfoLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrderInfoLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const { clearCurrentOrder, clearOrderModalData } = orderSlice.actions;

export const {
  selectCurrentOrder,
  selectOrderModalData,
  selectOrderRequest,
  selectIsOrderInfoLoading,
  selectOrderError
} = orderSlice.selectors;

export default orderSlice.reducer;
