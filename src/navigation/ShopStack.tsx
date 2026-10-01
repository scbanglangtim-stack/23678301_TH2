import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import DetailScreen from '@screens/DetailScreen';
import { VARIANT } from '@constants/student';

export type ShopStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export const ShopStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#EFF6FF',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          presentation: VARIANT.detailPresentation === 'modal' ? 'modal' : 'card',
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopStack;
