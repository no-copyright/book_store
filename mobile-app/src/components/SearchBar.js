import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

const SearchBar = ({ onSearch, searchValue, onChangeText, placeholder = 'Tìm kiếm sách...' }) => {
  const navigation = useNavigation();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    } else {
      navigation.navigate('Search', { searchQuery: searchValue });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.darkGrey} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.darkGrey}
          value={searchValue}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchValue ? (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.darkGrey} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 16,
    color: COLORS.textDark,
  },
});

export default SearchBar; 