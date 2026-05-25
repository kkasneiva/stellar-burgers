import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsUserLoading,
  selectUser,
  selectUserError,
  updateUser
} from '../../services/slices/userSlice';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);
  const isUserLoading = useSelector(selectIsUserLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!user || isUserLoading || !isFormChanged) return;

    const changedUserData: Partial<TRegisterData> = {};

    if (formValue.name !== user.name) {
      changedUserData.name = formValue.name;
    }

    if (formValue.email !== user.email) {
      changedUserData.email = formValue.email;
    }

    if (formValue.password) {
      changedUserData.password = formValue.password;
    }

    try {
      await dispatch(updateUser(changedUserData)).unwrap();
    } catch {
      // Ошибка уже сохранена в userSlice и выводится через updateUserError
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
