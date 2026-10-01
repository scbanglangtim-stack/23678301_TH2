import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from './ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export type MainTabsParamList = {
  Shop: undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Emoji Icons for Tabs without relying on heavy external vector font packages
const TabIcon = ({ name, focused }: { name: 'shop' | 'cart' | 'me'; focused: boolean }) => {
  let emoji = '🏪';
  if (name === 'cart') emoji = '🛒';
  if (name === 'me') emoji = '👤';

  return (
    <Text style={[styles.iconText, { opacity: focused ? 1 : 0.6 }]}>
      {emoji}
    </Text>
  );
};

export const MainTabs = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const shopTabScreen = (
    <Tab.Screen
      key="shop"
      name="Shop"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        tabBarIcon: ({ focused }) => <TabIcon name="shop" focused={focused} />,
      }}
    />
  );

  const cartTabScreen = (
    <Tab.Screen
      key="cart"
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Giỏ hàng',
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: COLORS.white,
          fontSize: 10,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused }) => <TabIcon name="cart" focused={focused} />,
      }}
    />
  );

  const meTabScreen = (
    <Tab.Screen
      key="me"
      name="Me"
      component={MeScreen}
      options={{
        title: 'Tôi',
        tabBarIcon: ({ focused }) => <TabIcon name="me" focused={focused} />,
      }}
    />
  );

  // Thứ tự Tab theo VARIANT.tabOrder ('shopFirst' hoặc 'cartFirst')
  const screens =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartTabScreen, shopTabScreen, meTabScreen]
      : [shopTabScreen, cartTabScreen, meTabScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {screens}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconText: {
    fontSize: 20,
  },
});

export default MainTabs;
