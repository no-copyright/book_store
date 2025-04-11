import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    lastAction: null, // Track the last action
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Add new item with selected property set to true
        state.items.push({ ...newItem, quantity: 1, selected: true });
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );
      
      // Set last action for notification
      state.lastAction = {
        type: 'ADD_TO_CART',
        payload: newItem,
        timestamp: Date.now()
      };
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      
      // Tính toán lại tổng tiền và tổng số lượng
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
      }
      
      // Tính toán lại tổng tiền và tổng số lượng
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );
    },
    
    // Thêm action mới để toggle trạng thái selected
    toggleSelected: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.selected = !item.selected;
      }
      
      // Chỉ tính tổng tiền cho các mục đã chọn
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.selected ? item.price * item.quantity : 0), 0
      );
    },
    
    // Action để chọn/bỏ chọn tất cả
    selectAll: (state, action) => {
      const selectStatus = action.payload;
      state.items.forEach(item => {
        item.selected = selectStatus;
      });
      
      // Tính lại tổng tiền
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.selected ? item.price * item.quantity : 0), 0
      );
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
    
    // Add a function to clear the last action
    clearLastAction: (state) => {
      state.lastAction = null;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  toggleSelected, 
  selectAll,
  clearCart,
  clearLastAction
} = cartSlice.actions;

export default cartSlice.reducer;