import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBuyerAuth } from '../hooks/useBuyerAuth';
import { useCart } from '../context/CartContext';
import productApi from '../api/productApi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useBuyerAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch product details
        const productData = await productApi.getProductDetails(id);
        setProduct(productData);
        setSelectedImage(0); // Reset selected image when product changes
        
        // Fetch related products
        const relatedData = await productApi.getRelatedProducts(id);
        setRelatedProducts(relatedData);
        
        // Fetch product reviews
        const reviewsData = await productApi.getProductReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stockQuantity || 10)) {
      setQuantity(value);
    }
  };

  // Increase quantity
  const increaseQuantity = () => {
    if (quantity < (product?.stockQuantity || 10)) {
      setQuantity(quantity + 1);
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      await addItem(product.id, quantity);
      
      // Show success notification or feedback
      alert('Product added to cart!'); // Replace with toast notification
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.'); // Replace with toast notification
    } finally {
      setAddingToCart(false);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    try {
      // Call API to add to wishlist
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('buyerToken')}`
        },
        body: JSON.stringify({
          productId: product.id
        })
      });
      
      // Show success message (could use toast notification)
      alert('Product added to wishlist!');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist. Please try again.');
    }
  };

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Placeholder product for development
  const placeholderProduct = {
    id: productId || '1',
    name: 'Premium Smartphone X',
    description: 'The latest smartphone with advanced features including a high-resolution camera, fast processor, and long-lasting battery life. Perfect for photography enthusiasts and power users.',
    price: 999.99,
    originalPrice: 1199.99,
    discount: 17,
    stockQuantity: 15,
    brand: 'TechBrand',
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/600x400'
    ],
    specifications: [
      { name: 'Display', value: '6.7-inch OLED' },
      { name: 'Processor', value: 'Octa-core 2.8GHz' },
      { name: 'RAM', value: '8GB' },
      { name: 'Storage', value: '256GB' },
      { name: 'Camera', value: '48MP + 12MP + 8MP' },
      { name: 'Battery', value: '4500mAh' }
    ],
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-05-20T14:30:00Z'
  };

  // Placeholder related products
  const placeholderRelated = [
    {
      id: '2',
      name: 'Wireless Earbuds',
      price: 129.99,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: '3',
      name: 'Smartphone Case',
      price: 24.99,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: '4',
      name: 'Screen Protector',
      price: 14.99,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: '5',
      name: 'Fast Wireless Charger',
      price: 49.99,
      image: 'https://via.placeholder.com/300x200'
    }
  ];

  // Placeholder reviews
  const placeholderReviews = [
    {
      id: '1',
      userId: '101',
      userName: 'John Smith',
      rating: 5,
      comment: 'Excellent product! The camera quality is outstanding and battery life is impressive.',
      createdAt: '2023-06-10T09:45:00Z'
    },
    {
      id: '2',
      userId: '102',
      userName: 'Emma Johnson',
      rating: 4,
      comment: 'Great phone overall. The only downside is that it gets a bit warm during gaming sessions.',
      createdAt: '2023-05-28T14:20:00Z'
    },
    {
      id: '3',
      userId: '103',
      userName: 'Michael Brown',
      rating: 5,
      comment: 'Best smartphone I\'ve ever owned. The display is stunning and performance is top-notch.',
      createdAt: '2023-04-15T11:30:00Z'
    }
  ];

  // Use real data if available, otherwise use placeholders
  const displayProduct = product || (loading ? null : placeholderProduct);
  const displayRelated = relatedProducts.length ? relatedProducts : placeholderRelated;
  const displayReviews = reviews.length ? reviews : placeholderReviews;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex py-3 text-gray-500 text-sm">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-gray-900">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/products/category/${displayProduct?.category}`} className="hover:text-gray-900">
            {displayProduct?.category || 'Category'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{displayProduct?.name || 'Product'}</span>
        </nav>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-6">
            {error}
          </div>
        ) : displayProduct ? (
          <>
            {/* Product detail section */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Product images */}
                <div>
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={displayProduct.images[selectedImage]}
                      alt={displayProduct.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail images */}
                  {displayProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {displayProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                            selectedImage === index 
                              ? 'ring-2 ring-indigo-500' 
                              : 'ring-1 ring-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${displayProduct.name} - Image ${index + 1}`}
                            className="w-full h-full object-center object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Product information */}
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{displayProduct.name}</h1>
                  
                  {/* Brand */}
                  <p className="mt-1 text-sm text-gray-500">
                    Brand: <span className="font-medium text-gray-900">{displayProduct.brand}</span>
                  </p>
                  
                  {/* Rating */}
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 flex-shrink-0 ${
                            averageRating > rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">
                      {displayReviews.length} {displayReviews.length === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                  
                  {/* Price */}
                  <div className="mt-4">
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-gray-900">${displayProduct.price.toFixed(2)}</p>
                      {displayProduct.originalPrice && (
                        <>
                          <p className="ml-3 text-lg text-gray-500 line-through">${displayProduct.originalPrice.toFixed(2)}</p>
                          <p className="ml-2 text-sm font-medium text-red-600">
                            Save {displayProduct.discount}%
                          </p>
                        </>
                      )}
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500">
                      {displayProduct.stockQuantity > 0 
                        ? `In stock (${displayProduct.stockQuantity} available)` 
                        : 'Out of stock'}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="mt-4">
                    <h3 className="sr-only">Description</h3>
                    <div className="text-base text-gray-700">
                      <p>{displayProduct.description}</p>
                    </div>
                  </div>
                  
                  {/* Quantity and Add to cart */}
                  <div className="mt-8">
                    {displayProduct.stockQuantity > 0 ? (
                      <>
                        <div className="flex items-center mt-4">
                          <h3 className="text-sm font-medium text-gray-900 w-20">Quantity</h3>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              type="button"
                              onClick={decreaseQuantity}
                              disabled={quantity <= 1}
                              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={handleQuantityChange}
                              min="1"
                              max={displayProduct.stockQuantity}
                              className="w-12 text-center border-0 focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={increaseQuantity}
                              disabled={quantity >= displayProduct.stockQuantity}
                              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex space-x-3">
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 bg-indigo-600 py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleAddToWishlist}
                            className="flex-1 bg-white py-3 px-8 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add to Wishlist
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-gray-300 py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-500 cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Product specifications */}
              {displayProduct.specifications && displayProduct.specifications.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayProduct.specifications.map((spec, index) => (
                      <div key={index} className="flex">
                        <span className="font-medium text-gray-900 w-1/3">{spec.name}:</span>
                        <span className="text-gray-700">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Product reviews */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-10">
              <div className="px-6 py-6">
                <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                
                {displayReviews.length === 0 ? (
                  <p className="mt-4 text-gray-500">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="mt-6 space-y-6 divide-y divide-gray-200">
                    {displayReviews.map((review) => (
                      <div key={review.id} className="pt-6 first:pt-0">
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <svg
                                key={rating}
                                className={`h-4 w-4 flex-shrink-0 ${
                                  review.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="ml-2 text-sm font-medium text-gray-900">{review.userName}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(review.createdAt)}
                        </p>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {isAuthenticated ? (
                  <div className="mt-8">
                    <Link
                      to={`/products/${productId}/review`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Write a Review
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8">
                    <Link
                      to={`/login?redirect=/products/${productId}/review`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Sign in to write a review
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Related products */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">You might also like</h2>
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                {displayRelated.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="group relative">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-center object-cover group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <Link to={`/products/${relatedProduct.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {relatedProduct.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="text-sm font-medium text-gray-900">${relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;