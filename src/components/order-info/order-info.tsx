import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeedOrders } from '../../services/slices/feedSlice';
import { selectProfileOrders } from '../../services/slices/profileOrdersSlice';
import {
  getOrderByNumber,
  selectCurrentOrder,
  selectIsOrderInfoLoading
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const orderNumber = Number(number);

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const isOrderInfoLoading = useSelector(selectIsOrderInfoLoading);

  const orderData = useMemo(
    () =>
      feedOrders.find((order) => order.number === orderNumber) ||
      profileOrders.find((order) => order.number === orderNumber) ||
      (currentOrder?.number === orderNumber ? currentOrder : null),
    [feedOrders, profileOrders, currentOrder, orderNumber]
  );

  useEffect(() => {
    if (!orderNumber || orderData) return;

    dispatch(getOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isOrderInfoLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
