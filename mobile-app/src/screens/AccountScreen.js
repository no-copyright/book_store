import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const AccountScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: '1',
      title: 'Đơn hàng của tôi',
      icon: 'receipt-outline',
      onPress: () => {}
    },
    {
      id: '2',
      title: 'Sách yêu thích',
      icon: 'heart-outline',
      onPress: () => {}
    },
    {
      id: '3',
      title: 'Thông tin cá nhân',
      icon: 'person-outline',
      onPress: () => {}
    },
    {
      id: '4',
      title: 'Địa chỉ giao hàng',
      icon: 'location-outline',
      onPress: () => {}
    },
    {
      id: '5',
      title: 'Phương thức thanh toán',
      icon: 'card-outline',
      onPress: () => {}
    },
    {
      id: '6',
      title: 'Thông báo',
      icon: 'notifications-outline',
      onPress: () => {}
    },
    {
      id: '7',
      title: 'Liên hệ & Hỗ trợ',
      icon: 'call-outline',
      onPress: () => navigation.navigate('Contact')
    },
    {
      id: '8',
      title: 'Cài đặt',
      icon: 'settings-outline',
      onPress: () => {}
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={item.icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.darkGrey} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>Người dùng</Text>
            <Text style={styles.emailText}>Chưa đăng nhập</Text>
          </View>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuSectionTitle}>Tài khoản của tôi</Text>
        {menuItems.slice(0, 5).map(renderMenuItem)}
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuSectionTitle}>Cài đặt & Khác</Text>
        {menuItems.slice(5).map(renderMenuItem)}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: COLORS.lightGrey,
  },
  loginButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 16,
    padding: 10,
    marginTop: 16,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginLeft: 10,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 10,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 20,
  },
});

export default AccountScreen; 