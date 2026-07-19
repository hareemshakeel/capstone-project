import api from './axios';

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/users/profile', profileData);
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await api.put('/users/password', passwordData);
  return data;
};
