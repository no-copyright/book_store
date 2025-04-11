import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

// Dữ liệu mẫu cho các thông báo
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng #12345 đã được xác nhận',
    message: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị giao hàng.',
    time: '15 phút trước',
    isRead: false,
    icon: 'receipt-outline',
    color: COLORS.primary,
  },
  {
    id: '2',
    type: 'delivery',
    title: 'Đơn hàng đang vận chuyển',
    message: 'Đơn hàng #12345 đang được vận chuyển và dự kiến sẽ được giao vào ngày mai.',
    time: '2 giờ trước',
    isRead: false,
    icon: 'bicycle-outline',
    color: '#4CAF50',
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Khuyến mãi mới: Giảm 20%',
    message: 'Giảm giá 20% cho tất cả sách văn học trong tuần này. Nhanh tay mua ngay!',
    time: '1 ngày trước',
    isRead: true,
    icon: 'pricetags-outline',
    color: '#FF9800',
  },
  {
    id: '4',
    type: 'wishlist',
    title: 'Sách yêu thích giảm giá',
    message: 'Cuốn sách "Đắc Nhân Tâm" trong danh sách yêu thích của bạn đang được giảm giá 30%.',
    time: '2 ngày trước',
    isRead: true,
    icon: 'heart-outline',
    color: '#E91E63',
  },
  {
    id: '5',
    type: 'system',
    title: 'Cập nhật ứng dụng',
    message: 'Phiên bản mới của ứng dụng đã sẵn sàng. Cập nhật ngay để trải nghiệm các tính năng mới!',
    time: '3 ngày trước',
    isRead: true,
    icon: 'sync-outline',
    color: '#607D8B',
  },
];

const NotificationScreen = () => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Thông báo</Text>
      <TouchableOpacity style={styles.markAllButton}>
        <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1376/1376544.png' }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>Không có thông báo</Text>
      <Text style={styles.emptyText}>
        Khi có thông báo mới, bạn sẽ nhận được thông tin tại đây.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  markAllButton: {
    padding: 5,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#F5F8FF',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.dark,
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginLeft: 5,
  },
  message: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 15,
    right: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.darkGrey,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationScreen; 