import { useSearchParams } from 'react-router-dom';
import ProductsPage from './ProductsPage';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // We'll reuse the ProductsPage component but with search context
  return <ProductsPage />;
};

export default SearchResultsPage;