import React from 'react';
import { View, StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/colors';
import 'react-native-gesture-handler';

// Bỏ qua một số cảnh báo
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Possible Unhandled Promise Rejection',
  'Remote debugger',
  'Animated: `useNativeDriver`'
]);

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <AppNavigator />
      </View>
    </Provider>
  );
}
