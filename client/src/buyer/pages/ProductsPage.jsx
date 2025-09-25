import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination and filtering state
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });
  
  // Get search query from URL if present
  const searchQuery = searchParams.get('q') || '';
  const productsPerPage = 12;

  // Fetch products and categories on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch categories (only once)
        if (categories.length === 0) {
          const categoriesData = await productApi.getCategories();
          setCategories(categoriesData);
        }
        
        // Fetch filtered products
        let productsData;
        
        if (searchQuery) {
          // Search products
          productsData = await productApi.searchProducts(
            searchQuery,
            currentPage,
            productsPerPage,
            {
              category: filters.category,
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
              sort: filters.sort
            }
          );
        } else if (filters.category) {
          // Get products by category
          productsData = await productApi.getProductsByCategory(
            filters.category,
            currentPage,
            productsPerPage,
            filters.sort
          );
        } else {
          // Get all products
          productsData = await productApi.searchProducts(
            '',
            currentPage,
            productsPerPage,
            {
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
              sort: filters.sort
            }
          );
        }
        
        setProducts(productsData.products);
        setTotalProducts(productsData.total);
        setTotalPages(Math.ceil(productsData.total / productsPerPage));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage, filters, searchQuery, categories.length]);

  // Update URL with current filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (filters.category) {
      params.set('category', filters.category);
    }
    
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    }
    
    if (filters.sort !== 'newest') {
      params.set('sort', filters.sort);
    }
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, currentPage, searchQuery, navigate]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  // Handle price filter submission
  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const minPrice = formData.get('minPrice');
    const maxPrice = formData.get('maxPrice');
    
    setFilters(prev => ({
      ...prev,
      minPrice,
      maxPrice
    }));
    
    // Reset to page 1
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setCurrentPage(1);
    
    if (searchQuery) {
      navigate(`/products/search?q=${searchQuery}`);
    } else {
      navigate('/products');
    }
  };

  // Placeholder products for development
  const placeholderProducts = Array(12).fill().map((_, index) => ({
    id: (index + 1).toString(),
    name: `Product ${index + 1}`,
    price: 49.99 + index * 10,
    image: 'https://via.placeholder.com/300x200',
    category: 'Electronics',
  }));

  // Placeholder categories for development
  const placeholderCategories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Home & Kitchen' },
    { id: '4', name: 'Books' },
    { id: '5', name: 'Sports & Outdoors' },
  ];

  // Use real data if available, otherwise use placeholders
  const displayProducts = products.length ? products : (loading ? [] : placeholderProducts);
  const displayCategories = categories.length ? categories : placeholderCategories;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : filters.category 
                ? `${categories.find(c => c.id === filters.category)?.name || 'Category'} Products` 
                : 'All Products'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {loading ? 'Loading products...' : `Showing ${displayProducts.length} of ${totalProducts} products`}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
                
                {/* Category filter */}
                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {displayCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Price range filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                  <form onSubmit={handlePriceFilterSubmit}>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="minPrice" className="sr-only">
                          Minimum Price
                        </label>
                        <input
                          type="number"
                          id="minPrice"
                          name="minPrice"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={handleFilterChange}
                          min="0"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="maxPrice" className="sr-only">
                          Maximum Price
                        </label>
                        <input
                          type="number"
                          id="maxPrice"
                          name="maxPrice"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={handleFilterChange}
                          min="0"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply
                    </button>
                  </form>
                </div>
                
                {/* Sort order */}
                <div className="mb-6">
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Popularity</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                
                {/* Clear filters button */}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <h2 className="text-xl font-medium text-gray-900 mb-4">No products found</h2>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `We couldn't find any products matching "${searchQuery}".`
                    : 'No products match your selected filters.'}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayProducts.map((product) => (
                    <div key={product.id} className="group relative">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={product.image || 'https://via.placeholder.com/300x200'}
                          alt={product.name}
                          className="w-full h-full object-center object-cover group-hover:opacity-75"
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
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Show page numbers */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        
                        // Show current page, first and last pages, and pages around current page
                        if (
                          pageNumber === 1 || 
                          pageNumber === totalPages || 
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNumber === currentPage
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
                        // Show ellipsis
                        if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;