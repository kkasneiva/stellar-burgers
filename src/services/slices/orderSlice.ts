import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  currentOrder: TOrder | null;
  isOrderInfoLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
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

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    }
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
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
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;

export const {
  selectCurrentOrder,
  selectIsOrderInfoLoading,
  selectOrderError
} = orderSlice.selectors;

export default orderSlice.reducer;
