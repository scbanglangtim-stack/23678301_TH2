import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import ShopStack from './ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { VARIANT } from '@constants/student';

export type MainTabsParamList = {
  Shop: undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const totalQuantity = useCartStore((s) => s.totalQuantity());

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let label = 'Cửa hàng';
        if (route.name === 'Cart') label = 'Giỏ';
        if (route.name === 'Me') label = 'Tôi';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
          >
            <View style={styles.labelContainer}>
              <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>
                {label}
              </Text>
              {route.name === 'Cart' && totalQuantity > 0 && (
                <View style={styles.badgeCircle}>
                  <Text style={styles.badgeText}>{totalQuantity}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MainTabs = () => {
  const shopTab = (
    <Tab.Screen
      key="shop"
      name="Shop"
      component={ShopStack}
      options={{ title: 'Cửa hàng' }}
    />
  );

  const cartTab = (
    <Tab.Screen
      key="cart"
      name="Cart"
      component={CartScreen}
      options={{ title: 'Giỏ' }}
    />
  );

  const meTab = (
    <Tab.Screen
      key="me"
      name="Me"
      component={MeScreen}
      options={{ title: 'Tôi' }}
    />
  );

  const screens =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartTab, shopTab, meTab]
      : [shopTab, cartTab, meTab];

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {screens}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#BFDBFE',
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 4,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  badgeCircle: {
    backgroundColor: '#EA580C',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
  },
});

export default MainTabs;
