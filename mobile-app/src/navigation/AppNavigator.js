import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearLastAction } from '../redux/slices/cartSlice';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AccountScreen from '../screens/AccountScreen';
import SearchScreen from '../screens/SearchScreen';
import ContactScreen from '../screens/ContactScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 10
        }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ 
          title: 'Chi tiết sản phẩm',
          headerShown: false // Ẩn header vì sẽ có header riêng trong màn hình chi tiết
        }} 
      />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Tìm kiếm' }} />
    </Stack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 10
        }
      }}
    >
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Danh mục sách' }} />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ 
          title: 'Chi tiết sản phẩm',
          headerShown: false
        }} 
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 10
        }
      }}
    >
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Thanh toán' }} />
    </Stack.Navigator>
  );
}

function NotificationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 10
        }
      }}
    >
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ title: 'Thông báo' }} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 10
        }
      }}
    >
      <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Tài khoản' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Liên hệ' }} />
    </Stack.Navigator>
  );
}

// Component for displaying badge on cart icon
function CartIcon({ focused, color, size }) {
  // Lấy ra số lượng loại sản phẩm khác nhau thay vì tổng số lượng sản phẩm
  const uniqueItems = useSelector(state => state.cart.items.length);
  
  return (
    <View style={{ width: 24, height: 24 }}>
      <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
      {uniqueItems > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: COLORS.error,
            borderRadius: 10,
            width: 18,
            height: 18,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold' }}>
            {uniqueItems > 99 ? '99+' : uniqueItems}
          </Text>
        </View>
      )}
    </View>
  );
}

// Component hiển thị thông báo khi thêm sản phẩm vào giỏ hàng
function TabBarWithNotification({ state, descriptors, navigation }) {
  const lastAction = useSelector(state => state.cart.lastAction);
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');

  React.useEffect(() => {
    if (lastAction && lastAction.type === 'ADD_TO_CART') {
      setNotificationMessage(`Đã thêm "${lastAction.payload.title}" vào giỏ hàng`);
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
        dispatch(clearLastAction()); // Clear the last action
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  return (
    <View style={{ position: 'relative' }}>
      {showNotification && (
        <View style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          backgroundColor: COLORS.primary,
          padding: 8,
          zIndex: 1000,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{ color: COLORS.white, flex: 1, fontSize: 13 }} numberOfLines={1}>
            {notificationMessage}
          </Text>
          <TouchableOpacity onPress={() => setShowNotification(false)}>
            <Ionicons name="close" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGrey,
        height: 65, // Tăng chiều cao thanh nav
        paddingBottom: Platform.OS === 'ios' ? 15 : 10,
        paddingTop: 5,
        elevation: 8, // Thêm bóng đổ cho Android
        shadowColor: '#000', // Thêm bóng đổ cho iOS
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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

          // Get the icon component from options
          const IconComponent = options.tabBarIcon;

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{ 
                flex: 1, 
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              {IconComponent && IconComponent({ 
                focused: isFocused, 
                color: isFocused ? COLORS.primary : COLORS.darkGrey, 
                size: 22
              })}
              <Text style={{ 
                color: isFocused ? COLORS.primary : COLORS.darkGrey,
                fontSize: 11,
                marginTop: 3
              }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// Component hiển thị badge cho icon thông báo
function NotificationIcon({ focused, color, size }) {
  // Giả sử chúng ta có 3 thông báo mới
  const newNotificationsCount = 3;
  
  return (
    <View style={{ width: 24, height: 24 }}>
      <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size} color={color} />
      {newNotificationsCount > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: COLORS.error,
            borderRadius: 10,
            width: 18,
            height: 18,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: 'bold' }}>
            {newNotificationsCount > 99 ? '99+' : newNotificationsCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBarWithNotification {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          } else if (route.name === 'CategoriesTab') {
            return <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />;
          } else if (route.name === 'NotificationTab') {
            return <NotificationIcon focused={focused} color={color} size={size} />;
          } else if (route.name === 'CartTab') {
            return <CartIcon focused={focused} color={color} size={size} />;
          } else if (route.name === 'AccountTab') {
            return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGrey,
        headerShown: false,
        tabBarStyle: {
          height: 65, // Tăng chiều cao thanh nav
          paddingBottom: Platform.OS === 'ios' ? 15 : 10,
        }
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ 
          title: 'Trang chủ',
        }} 
      />
      <Tab.Screen 
        name="CategoriesTab" 
        component={CategoriesStack} 
        options={{ 
          title: 'Danh mục',
        }} 
      />
      <Tab.Screen 
        name="NotificationTab" 
        component={NotificationStack} 
        options={{ 
          title: 'Thông báo',
        }} 
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartStack} 
        options={{ 
          title: 'Giỏ hàng',
        }} 
      />
      <Tab.Screen 
        name="AccountTab" 
        component={AccountStack} 
        options={{ 
          title: 'Tài khoản',
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}