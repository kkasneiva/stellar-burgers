import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isProfileOrdersLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isProfileOrdersLoading: false,
  error: null
};

export const getProfileOrders = createAsyncThunk(
  'profileOrders/getProfileOrders',
  async () => getOrdersApi()
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectIsProfileOrdersLoading: (state) => state.isProfileOrdersLoading,
    selectProfileOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
        state.error = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      });
  }
});

export const {
  selectProfileOrders,
  selectIsProfileOrdersLoading,
  selectProfileOrdersError
} = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
