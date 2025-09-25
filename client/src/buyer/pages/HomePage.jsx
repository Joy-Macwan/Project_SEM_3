import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerAuth } from '../hooks/useBuyerAuth';
import buyerApi from '../api/buyerApi';

const HomePage = () => {
  const { isAuthenticated, currentUser } = useBuyerAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await buyerApi.get('/products/featured');
        setFeaturedProducts(productsResponse.data);
        
        // Fetch categories
        const categoriesResponse = await buyerApi.get('/products/categories');
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Placeholder for featured products if API fails or during development
  const placeholderProducts = [
    {
      id: 1,
      name: 'Smartphone X',
      price: 999.99,
      image: 'https://via.placeholder.com/300x200',
      category: 'Electronics',
    },
    {
      id: 2,
      name: 'Designer Watch',
      price: 299.99,
      image: 'https://via.placeholder.com/300x200',
      category: 'Fashion',
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      price: 199.99,
      image: 'https://via.placeholder.com/300x200',
      category: 'Electronics',
    },
    {
      id: 4,
      name: 'Leather Jacket',
      price: 349.99,
      image: 'https://via.placeholder.com/300x200',
      category: 'Fashion',
    },
  ];

  // Placeholder for categories if API fails or during development
  const placeholderCategories = [
    { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/100x100' },
    { id: 2, name: 'Fashion', image: 'https://via.placeholder.com/100x100' },
    { id: 3, name: 'Home & Kitchen', image: 'https://via.placeholder.com/100x100' },
    { id: 4, name: 'Sports & Outdoors', image: 'https://via.placeholder.com/100x100' },
  ];

  // Use real data if available, otherwise use placeholders
  const displayProducts = featuredProducts.length ? featuredProducts : placeholderProducts;
  const displayCategories = categories.length ? categories : placeholderCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to Our Marketplace
            </h1>
            <p className="mt-6 text-xl max-w-2xl mx-auto">
              Discover unique products from sellers around the world
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50"
              >
                Browse Products
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Shop by Category</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {displayCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products/category/${category.id}`}
                className="group"
              >
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-center object-cover group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-gray-700 text-sm font-medium text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured products section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Featured Products</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-center object-cover group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Call to action section */}
      {!isAuthenticated && (
        <div className="bg-indigo-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-indigo-600">Create an account today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;