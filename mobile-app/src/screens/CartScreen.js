import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeFromCart, 
  updateQuantity, 
  toggleSelected,
  selectAll,
  clearCart 
} from '../redux/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  
  // Tính số mục đã chọn
  const selectedItems = cartItems.filter(item => item.selected);
  
  // Kiểm tra xem tất cả các mục đã được chọn hay chưa
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
  
  const handleRemoveItem = (id) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          onPress: () => dispatch(removeFromCart(id))
        }
      ]
    );
  };
  
  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleToggleSelected = (id) => {
    dispatch(toggleSelected(id));
  };
  
  const handleSelectAll = () => {
    dispatch(selectAll(!allSelected));
  };
  
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    navigation.navigate('Checkout');
  };
  
  // Update the renderCartItem function to handle both image and cover properties
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Checkbox to select product */}
      <TouchableOpacity
        onPress={() => handleToggleSelected(item.id)}
        style={styles.checkbox}
      >
        <Ionicons
          name={item.selected ? "checkbox" : "square-outline"}
          size={24}
          color={item.selected ? "#2196F3" : "#757575"}
        />
      </TouchableOpacity>
      
      <Image 
        source={{ uri: item.image || item.cover }} 
        style={styles.itemImage}
        resizeMode="cover" 
      />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemAuthor}>{item.author}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} ₫</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityBtnText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeBtn}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  // Hiển thị khi giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#cccccc" />
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        <TouchableOpacity 
          style={styles.shopBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopBtnText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Phần header với nút chọn tất cả */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.selectAllContainer}
          onPress={handleSelectAll}
        >
          <Ionicons
            name={allSelected ? "checkbox" : "square-outline"}
            size={24}
            color={allSelected ? "#2196F3" : "#757575"}
          />
          <Text style={styles.selectAllText}>Chọn tất cả</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={styles.clearText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      
      {/* Footer với thông tin tổng tiền và nút thanh toán */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng tiền ({selectedItems.length} sản phẩm):</Text>
          <Text style={styles.totalAmount}>{totalAmount.toLocaleString('vi-VN')} ₫</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.checkoutBtn,
            selectedItems.length === 0 ? styles.disabledBtn : null
          ]}
          onPress={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.checkoutBtnText}>Mua hàng</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#757575',
  },
  clearText: {
    fontSize: 16,
    color: '#FF5252',
  },
  list: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  checkbox: {
    marginRight: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemAuthor: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeBtn: {
    marginLeft: 'auto',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
  },
  shopBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#757575',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5252',
  },
  checkoutBtn: {
    backgroundColor: '#FF5252',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledBtn: {
    backgroundColor: '#e0e0e0',
  },
});

export default CartScreen;