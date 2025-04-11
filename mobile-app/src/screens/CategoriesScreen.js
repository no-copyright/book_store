import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  ScrollView
} from 'react-native';
import { COLORS } from '../utils/colors';
import { BOOKS, CATEGORIES } from '../utils/mockData';
import SearchBar from '../components/SearchBar';
import BookItem from '../components/BookItem';
import CategoryFilter from '../components/CategoryFilter';

const CategoriesScreen = () => {
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
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    let filteredData = BOOKS;
    if (selectedCategory !== '1') {
      const categoryName = getCategoryName(selectedCategory);
      filteredData = BOOKS.filter(book => book.category === categoryName);
    }
    
    if (text) {
      filteredData = filteredData.filter(book => 
        book.title.toLowerCase().includes(text.toLowerCase()) ||
        book.author.toLowerCase().includes(text.toLowerCase())
      );
    }
    
    setFilteredBooks(filteredData);
  };

  const renderItem = ({ item }) => <BookItem book={item} />;

  return (
    <View style={styles.container}>
      <SearchBar 
        searchValue={searchQuery} 
        onChangeText={handleSearch}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.categoryTitle}>
            {getCategoryName(selectedCategory)}
          </Text>
          <Text style={styles.resultCount}>
            {filteredBooks.length} kết quả
          </Text>
        </View>

        <View style={styles.booksContainer}>
          {filteredBooks.length > 0 ? (
            <FlatList
              data={filteredBooks}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.bookRow}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy sách phù hợp</Text>
            </View>
          )}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  booksContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default CategoriesScreen;