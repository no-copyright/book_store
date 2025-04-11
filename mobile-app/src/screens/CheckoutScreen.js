import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice'; // Điều chỉnh đường dẫn nếu cần
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Kiểm tra nếu là mua ngay từ nút "Buy Now"
  const directBuy = route.params?.directBuy;
  const directProduct = route.params?.product;
  
  // Lấy sản phẩm đã chọn từ giỏ hàng hoặc từ mua ngay
  const cartItems = directBuy 
    ? [directProduct] 
    : useSelector(state => state.cart.items.filter(item => item.selected));
  
  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity), 0
  );
  
  // State cho phương thức thanh toán
  const [selectedPayment, setSelectedPayment] = useState('cod');
  
  // Danh sách phương thức thanh toán
  const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng', icon: 'cash-outline', color: '#4CAF50' },
    { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline', color: '#d82d8b' },
    { id: 'vnpay', name: 'VNPay', icon: 'card-outline', color: '#0066FF' },
    { id: 'bank', name: 'Chuyển khoản ngân hàng', icon: 'business-outline', color: '#FF9800' },
  ];
  
  const handlePlaceOrder = () => {
    Alert.alert(
      'Đặt hàng thành công',
      'Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Xóa giỏ hàng và quay lại trang chính
            dispatch(clearCart());
            navigation.reset({
              index: 0,
              routes: [{ name: 'HomeTab' }], // Điều chỉnh tên tab nếu cần
            });
          }
        }
      ]
    );
  };
  
  // Render từng sản phẩm
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image 
        source={{ uri: item.image || item.cover || 'https://via.placeholder.com/60x90' }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} ₫</Text>
          <Text style={styles.quantity}>x{item.quantity}</Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <TouchableOpacity style={styles.addressBox}>
            <View style={styles.addressContent}>
              <Ionicons name="location-outline" size={24} color="#2196F3" />
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressName}>Nguyễn Văn A</Text>
                <Text style={styles.addressPhone}>0987654321</Text>
                <Text style={styles.addressDetail}>123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#757575" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm ({cartItems.length})</Text>
          {cartItems.map(item => renderItem({ item }))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {paymentMethods.map(method => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.selectedPayment
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Ionicons name={method.icon} size={24} color={method.color} />
              <Text style={styles.paymentText}>{method.name}</Text>
              {selectedPayment === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Thêm khoảng trống để cuộn qua footer */}
        <View style={{ height: 140 }} />
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Tổng tiền hàng:</Text>
          <Text style={styles.summaryValue}>{totalAmount.toLocaleString('vi-VN')} ₫</Text>
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Phí vận chuyển:</Text>
          <Text style={styles.summaryValue}>30.000 ₫</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng thanh toán:</Text>
          <Text style={styles.totalValue}>
            {(totalAmount + 30000).toLocaleString('vi-VN')} ₫
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.orderBtn}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.orderBtnText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Thêm padding dưới cùng
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  addressName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressPhone: {
    color: '#666',
    marginVertical: 2,
  },
  addressDetail: {
    color: '#666',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  details: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  price: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantity: {
    color: '#666',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 5,
  },
  selectedPayment: {
    backgroundColor: '#f0f9ff',
  },
  paymentText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  orderBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  orderBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;