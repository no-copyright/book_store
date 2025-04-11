import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { COLORS } from '../utils/colors';
import { BOOKS } from '../utils/mockData';
import SearchBar from '../components/SearchBar';
import BookItem from '../components/BookItem';

const SearchScreen = ({ route }) => {
  const searchQueryFromParams = route.params?.searchQuery || '';
  const [searchQuery, setSearchQuery] = useState(searchQueryFromParams);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredBooks([]);
      return;
    }
    
    // Mô phỏng đang tìm kiếm
    setLoading(true);
    setTimeout(() => {
      const results = BOOKS.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(results);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (searchQueryFromParams) {
      handleSearch(searchQueryFromParams);
    }
  }, [searchQueryFromParams]);

  const renderItem = ({ item }) => <BookItem book={item} />;

  const renderEmptyResult = () => {
    if (searchQuery.trim() === '') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tìm kiếm sách theo tên hoặc tác giả</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy kết quả phù hợp</Text>
        <Text style={styles.emptySubText}>Hãy thử tìm kiếm với từ khóa khác</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar 
        searchValue={searchQuery} 
        onChangeText={handleSearch}
        onSearch={handleSearch}
        placeholder="Tìm theo tên sách, tác giả..."
      />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {filteredBooks.length > 0 && (
            <Text style={styles.resultCount}>
              Tìm thấy {filteredBooks.length} kết quả
            </Text>
          )}
          
          <FlatList
            data={filteredBooks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.bookRow}
            ListEmptyComponent={renderEmptyResult}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.textLight,
    marginVertical: 10,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default SearchScreen; 