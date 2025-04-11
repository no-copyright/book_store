import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    // Kiểm tra form
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin cần thiết');
      return;
    }

    // Xử lý gửi liên hệ thành công
    Alert.alert('Thành công', 'Cảm ơn bạn đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      id: '1',
      icon: 'call',
      title: 'Điện thoại',
      content: '0123 456 789',
    },
    {
      id: '2',
      icon: 'mail',
      title: 'Email',
      content: 'support@sachhay.com',
    },
    {
      id: '3',
      icon: 'location',
      title: 'Địa chỉ',
      content: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Liên hệ với chúng tôi</Text>
        <Text style={styles.headerSubtitle}>
          Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi qua các thông tin dưới đây
        </Text>
      </View>

      <View style={styles.infoSection}>
        {contactInfo.map(item => (
          <View key={item.id} style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name={item.icon} size={24} color={COLORS.white} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoText}>{item.content}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>Gửi tin nhắn cho chúng tôi</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và tên *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Nguyễn Văn A"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="example@gmail.com"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tiêu đề</Text>
          <TextInput
            style={styles.input}
            value={formData.subject}
            onChangeText={(text) => handleChange('subject', text)}
            placeholder="Nhập tiêu đề..."
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nội dung *</Text>
          <TextInput
            style={styles.textArea}
            value={formData.message}
            onChangeText={(text) => handleChange('message', text)}
            placeholder="Nhập nội dung tin nhắn..."
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi tin nhắn</Text>
          <Ionicons name="send" size={18} color={COLORS.white} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    padding: 20,
    backgroundColor: COLORS.white,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  formSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 30,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.textDark,
    height: 120,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  sendIcon: {
    marginLeft: 8,
  },
});

export default ContactScreen; 