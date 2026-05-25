import { useEffect, FC } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeed,
  selectFeedError,
  selectFeedOrders,
  selectIsFeedLoading
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const isFeedLoading = useSelector(selectIsFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  };

  if (isFeedLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium pt-10'>
        Ошибка загрузки ленты заказов
      </p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
