import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  Alert,
  findNodeHandle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { BOOKS } from '../utils/mockData';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const { width, height } = Dimensions.get('window');

// Dữ liệu mẫu cho phần bình luận
const SAMPLE_COMMENTS = [
  {
    id: '1',
    user: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random',
    content: 'Cuốn sách rất hay, tôi đã học được nhiều điều bổ ích từ nó!',
    rating: 5,
    date: '12/03/2023'
  },
  {
    id: '2',
    user: 'Trần Thị B',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=random',
    content: 'Nội dung sách rất chất lượng, đóng gói cẩn thận.',
    rating: 4,
    date: '05/04/2023'
  }
];

const ProductDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const dispatch = useDispatch();
  
  // Animated values
  const [isAnimating, setIsAnimating] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Ref cho icon giỏ hàng ở thanh tab
  const cartTabIconRef = useRef(null);
  
  // State cho position thực tế của icon giỏ hàng trong tab bar
  const [cartIconPosition, setCartIconPosition] = useState({ x: width, y: height });
  
  // State cho phần bình luận
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  
  // States cho các tính năng hiển thị
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [currentImage, setCurrentImage] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Tìm sách theo ID
  const book = BOOKS.find(item => item.id === bookId);
  
  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin sách</Text>
      </View>
    );
  }

  // Set ảnh mặc định
  useEffect(() => {
    if (book && book.images && book.images.length > 0) {
      setCurrentImage(book.images[0]);
    } else if (book && book.image) {
      setCurrentImage(book.image);
    }
  }, [book]);

  // Hiển thị tab bar khi component mount/unmount
  useEffect(() => {
    // Hiển thị tab bar
    navigation.getParent()?.getParent()?.setOptions({
      tabBarStyle: { display: 'flex' }
    });
    
    // When screen unmounts, ensure tab bar is visible
    return () => {
      navigation.getParent()?.getParent()?.setOptions({
        tabBarStyle: { display: 'flex' }
      });
    };
  }, [navigation]);
  
  // Tìm vị trí của icon giỏ hàng trong tab bar sau khi render
  useEffect(() => {
    // Đợi một chút để đảm bảo tab bar đã render
    const timeout = setTimeout(() => {
      if (cartTabIconRef.current) {
        // Sử dụng findNodeHandle để lấy ID của element
        const cartTabIconNode = findNodeHandle(cartTabIconRef.current);
        
        // Nếu có ref và đã mount, lấy vị trí trên screen
        cartTabIconNode && cartTabIconRef.current.measureInWindow((x, y, width, height) => {
          // Lưu vị trí của icon giỏ hàng
          setCartIconPosition({ 
            x: x + (width / 2), // Lấy vị trí trung tâm của icon
            y: y + (height / 2)
          });
        });
      } else {
        // Nếu không có ref, dùng vị trí mặc định (ở góc phải dưới)
        setCartIconPosition({ 
          x: width - 40, 
          y: height - 30
        });
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleAddComment = () => {
    if (comment.trim() === '') return;
    
    // Thêm bình luận mới
    const newComment = {
      id: (comments.length + 1).toString(),
      user: 'Người dùng',
      avatar: 'https://ui-avatars.com/api/?name=User&background=random',
      content: comment,
      rating: 5,
      date: new Date().toLocaleDateString('vi-VN')
    };
    
    setComments([newComment, ...comments]);
    setComment('');
  };

  // Cập nhật phần xử lý animation

  const handleAddToCart = () => {
    // Add to cart in Redux
    dispatch(addToCart(book));
    
    // Start animation
    setIsAnimating(true);
    
    // Get screen dimensions
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    
    // Target position (cart icon in tab bar)
    // Move these calculations to be more precise
    const targetX = windowWidth * 0.7; // Position it at 70% of screen width (where cart tab is)
    const targetY = windowHeight - 25; // Position at bottom of screen with small offset
    
    // Animation sequence
    const animationSequence = Animated.sequence([
      // 1. Product floats up slightly
      Animated.timing(positionAnim, {
        toValue: { x: 0, y: -50 },
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      
      // 2. Product flies to cart icon
      Animated.timing(positionAnim, {
        toValue: { x: targetX - width/2, y: targetY - 150 },
        duration: 800,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.back()),
      })
    ]);
    
    // Run animations in parallel
    Animated.parallel([
      animationSequence,
      // Scale down product
      Animated.timing(scaleAnim, {
        toValue: 0.3,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      // Fade out product
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Animation completed
      setIsAnimating(false);
      // Reset animation values
      scaleAnim.setValue(1);
      positionAnim.setValue({ x: 0, y: 0 });
      opacityAnim.setValue(1);
    });
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const shareProduct = () => {
    Alert.alert('Chia sẻ', 'Tính năng chia sẻ sản phẩm đang được phát triển');
  };
  
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };
  
  const buyNow = () => {
    // Add product to cart
    dispatch(addToCart(book));
    
    // Create an array with only one product for direct checkout
    const singleProduct = {...book, quantity: 1, selected: true};
    
    // Navigate to Checkout with direct buy parameter
    navigation.navigate('Checkout', {
      directBuy: true,
      product: singleProduct
    });
  };
  
  const handleSubmitReview = () => {
    if (!userRating || !userComment.trim()) return;
    
    // Thêm đánh giá mới
    const newReview = {
      id: (book.reviews?.length || 0) + 1,
      userName: 'Bạn',
      avatar: 'https://ui-avatars.com/api/?name=User&background=random',
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString('vi-VN')
    };
    
    // Cập nhật lại reviews array nếu nó tồn tại
    if (book.reviews) {
      book.reviews = [newReview, ...book.reviews];
    } else {
      book.reviews = [newReview];
    }
    
    // Reset các giá trị input
    setUserRating(0);
    setUserComment('');
    
    // Thông báo thành công
    Alert.alert('Thành công', 'Cảm ơn bạn đã gửi đánh giá!');
  };

  const renderCommentItem = (item) => (
    <View key={item.id} style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.commentDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <Ionicons 
              key={star}
              name={star <= item.rating ? "star" : "star-outline"} 
              size={14} 
              color="#FFD700" 
            />
          ))}
        </View>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  // Reference cho CartTabIcon trong TabNavigator
  const CartTabIconRef = () => {
    // Sử dụng setNativeProps để hiển thị một ref được forward
    // từ TabNavigator đến đây
    return (
      <View
        ref={cartTabIconRef}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? COLORS.primary : COLORS.dark}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={shareProduct}>
              <Ionicons name="share-social-outline" size={22} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: currentImage }} style={styles.mainImage} resizeMode="contain" />
          </View>

          <View style={styles.imageSelectorContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {book.images && book.images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnailContainer,
                    currentImage === img && styles.selectedThumbnail,
                  ]}
                  onPress={() => setCurrentImage(img)}
                >
                  <Image source={{ uri: img }} style={styles.thumbnail} resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <View style={styles.authorRow}>
              <Text style={styles.author}>Tác giả: {book.author}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{book.rating} ({book.reviewCount || 0})</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {book.price.toLocaleString('vi-VN')} ₫
              </Text>
              {book.originalPrice > book.price && (
                <>
                  <Text style={styles.originalPrice}>
                    {book.originalPrice.toLocaleString('vi-VN')} ₫
                  </Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <View style={styles.descriptionContainer}>
                <Text style={[styles.description, !showFullDescription && styles.collapsedDescription]}>
                  {book.description}
                </Text>
                {book.description && book.description.length > 150 && (
                  <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setShowFullDescription(!showFullDescription)}
                  >
                    <Text style={styles.showMoreText}>
                      {showFullDescription ? 'Rút gọn' : 'Xem thêm'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
                <Text style={styles.reviewCount}>{book.reviews?.length || 0} đánh giá</Text>
              </View>

              {book.reviews && book.reviews.slice(0, visibleReviews).map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.avatar || 'https://via.placeholder.com/150' }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewUser}>
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name="star"
                            size={14}
                            color={star <= review.rating ? '#FFD700' : '#e0e0e0'}
                            style={{ marginRight: 2 }}
                          />
                        ))}
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
              ))}

              {book.reviews && book.reviews.length > visibleReviews && (
                <TouchableOpacity
                  style={styles.showMoreReviewsButton}
                  onPress={() => setVisibleReviews(prev => prev + 2)}
                >
                  <Text style={styles.showMoreReviewsText}>Xem thêm đánh giá</Text>
                </TouchableOpacity>
              )}

              <View style={styles.addReviewContainer}>
                <Text style={styles.addReviewTitle}>Thêm đánh giá của bạn</Text>
                <View style={styles.ratingInput}>
                  <Text style={styles.ratingInputLabel}>Đánh giá: </Text>
                  <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setUserRating(star)}
                      >
                        <Ionicons
                          name={userRating >= star ? 'star' : 'star-outline'}
                          size={24}
                          color="#FFD700"
                          style={styles.ratingStar}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Viết nhận xét của bạn..."
                  multiline
                  value={userComment}
                  onChangeText={setUserComment}
                />
                <TouchableOpacity
                  style={[styles.submitButton, (!userRating || !userComment) && styles.disabledButton]}
                  disabled={!userRating || !userComment}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.wishlistButton]}
            onPress={toggleWishlist}
          >
            <Ionicons
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={22}
              color={isInWishlist ? COLORS.primary : COLORS.dark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.addToCartButton]}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.buyNowButton]} onPress={buyNow}>
            <Text style={styles.buyNowText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
        
        {/* Animation overlay */}
        {isAnimating && (
          <Animated.View
            style={[
              styles.animatedItem,
              {
                transform: [
                  { translateX: positionAnim.x },
                  { translateY: positionAnim.y },
                  { scale: scaleAnim }
                ],
                opacity: opacityAnim
              }
            ]}
          >
            <Image source={{ uri: currentImage }} style={styles.animatedImage} />
          </Animated.View>
        )}
        
        {/* Ref cho icon giỏ hàng trong tab bar */}
        <CartTabIconRef />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Thêm padding để tránh bị che bởi action buttons
  },
  imageContainer: {
    width: '100%',
    height: windowHeight * 0.25, // Giảm chiều cao hình ảnh xuống 25% chiều cao màn hình
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '80%',
    height: '100%',
  },
  imageSelectorContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedThumbnail: {
    borderColor: COLORS.primary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: COLORS.dark,
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.darkGrey,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  descriptionContainer: {
    maxHeight: windowHeight * 0.3,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 20,
  },
  collapsedDescription: {
    height: 80, // Giảm chiều cao mô tả khi bị thu gọn
    overflow: 'hidden',
  },
  showMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  showMoreText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  reviewItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewUser: {
    marginLeft: 10,
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginLeft: 5,
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 20,
  },
  showMoreReviewsButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  showMoreReviewsText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  addReviewContainer: {
    marginTop: 20,
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 15,
  },
  ratingInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingInputLabel: {
    fontSize: 14,
    color: COLORS.dark,
  },
  starContainer: {
    flexDirection: 'row',
  },
  ratingStar: {
    marginRight: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 80, // Giảm chiều cao input xuống
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  actionButton: {
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 45,
    marginRight: 10,
  },
  addToCartButton: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginRight: 10,
  },
  addToCartText: {
    color: COLORS.dark,
    fontWeight: 'bold',
    fontSize: 14,
  },
  buyNowButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  buyNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.darkGrey,
  },
  commentItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
    color: COLORS.darkGrey,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Animation styles
  animatedItem: {
    position: 'absolute',
    zIndex: 1000,
    left: width / 2 - 30, // Center of screen minus half of item width
    top: 150, // Start from product image area
  },
  animatedImage: {
    width: 60,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 5,
  },
});

export default ProductDetailScreen;