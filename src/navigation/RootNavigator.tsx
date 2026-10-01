import React from 'react';
import { useAuthStore } from '@stores/authStore';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export const RootNavigator = () => {
  const token = useAuthStore((state) => state.token);

  if (token === null) {
    return <AuthStack />;
  }

  return <MainTabs />;
};

export default RootNavigator;
