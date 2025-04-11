import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import { BANNER_DATA } from '../utils/mockData';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const renderItem = ({ item }) => {
    return (
      <View style={styles.bannerContainer}>
        <Image source={{ uri: item.image }} style={styles.banner} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNER_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        bounces={false}
      />
      <View style={styles.paginationContainer}>
        {BANNER_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.activePaginationDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
  },
  bannerContainer: {
    width,
    height: 180,
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.grey,
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default BannerSlider; 