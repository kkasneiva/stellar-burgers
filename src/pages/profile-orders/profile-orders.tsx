import { useEffect, FC } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getProfileOrders,
  selectIsProfileOrdersLoading,
  selectProfileOrders,
  selectProfileOrdersError
} from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isProfileOrdersLoading = useSelector(selectIsProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  if (isProfileOrdersLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium pt-10'>
        Ошибка загрузки истории заказов
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
