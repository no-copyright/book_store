import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { BOOKS } from '../utils/mockData';
import SearchBar from '../components/SearchBar';
import BookItem from '../components/BookItem';
import BannerSlider from '../components/BannerSlider';
import CategoryFilter from '../components/CategoryFilter';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1'); // Tất cả
  const [filteredBooks, setFilteredBooks] = useState(BOOKS);

  useEffect(() => {
    if (selectedCategory === '1') {
      // Tất cả
      setFilteredBooks(BOOKS);
    } else {
      const filtered = BOOKS.filter(book => {
        const categoryName = book.category;
        const selectedCategoryName = getCategoryName(selectedCategory);
        return categoryName === selectedCategoryName;
      });
      setFilteredBooks(filtered);
    }
  }, [selectedCategory]);

  const getCategoryName = (categoryId) => {
    const category = require('../utils/mockData').CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const renderBookItem = ({ item }) => <BookItem book={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Sách Hay</Text>
      </View>

      <SearchBar 
        searchValue={searchQuery} 
        onChangeText={setSearchQuery}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <BannerSlider />

        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sách nổi bật</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.booksContainer}>
          <FlatList
            data={filteredBooks}
            renderItem={renderBookItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.bookRow}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  booksContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen; 