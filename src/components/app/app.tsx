import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';

import '../../index.css';
import styles from './app.module.css';

const IngredientDetailsPage = () => (
  <main
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '120px'
    }}
  >
    <h1 className='text text_type_main-large mb-5'>Детали ингредиента</h1>
    <IngredientDetails />
  </main>
);

const OrderInfoPage = () => {
  const { number } = useParams();

  const orderNumber = number ? `#${number.padStart(6, '0')}` : '';

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '120px'
      }}
    >
      <h1 className='text text_type_digits-default mb-10'>{orderNumber}</h1>
      <OrderInfo />
    </main>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  const feedOrderMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');

  const orderNumber =
    feedOrderMatch?.params.number || profileOrderMatch?.params.number;

  const orderModalTitle = orderNumber ? `#${orderNumber.padStart(6, '0')}` : '';

  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfoPage />} />
            <Route
              path='/ingredients/:id'
              element={<IngredientDetailsPage />}
            />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfoPage />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal title={orderModalTitle} onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal title={orderModalTitle} onClose={handleCloseModal}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
