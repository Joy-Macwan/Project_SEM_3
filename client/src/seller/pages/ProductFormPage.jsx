import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SellerLayout from '../components/SellerLayout';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Initial form state
  const initialFormState = {
    name: '',
    description: '',
    category: '',
    condition: 'refurbished',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
    model: '',
    sku: '',
    warranty: '0',
    features: [''],
    specifications: [{ key: '', value: '' }],
    images: []
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // In a real app, this would be an API call
      // const fetchProduct = async () => {
      //   try {
      //     const response = await sellerApi.getProduct(id);
      //     setFormData(response.data);
      //   } catch (error) {
      //     console.error('Error fetching product:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      
      // For demo purposes, let's simulate fetching a product
      setTimeout(() => {
        setFormData({
          name: 'iPhone 12 Pro (Refurbished)',
          description: 'A fully refurbished iPhone 12 Pro in excellent condition. This device has been thoroughly tested and restored to factory settings.',
          category: 'Smartphones',
          condition: 'refurbished',
          price: '699.99',
          originalPrice: '999.99',
          stock: '8',
          brand: 'Apple',
          model: 'iPhone 12 Pro',
          sku: 'IP12P-REF',
          warranty: '6',
          features: [
            'Professionally refurbished',
            'Unlocked for all carriers',
            '6GB RAM and 128GB storage',
            'Battery health at 95% or higher'
          ],
          specifications: [
            { key: 'Screen Size', value: '6.1 inches' },
            { key: 'Processor', value: 'A14 Bionic' },
            { key: 'Camera', value: 'Triple 12MP' },
            { key: 'OS', value: 'iOS 14 (upgradable)' }
          ],
          images: [
            { id: 1, url: 'https://example.com/iphone12pro1.jpg' },
            { id: 2, url: 'https://example.com/iphone12pro2.jpg' }
          ]
        });
        setLoading(false);
      }, 500);
    }
  }, [id, isEditMode]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle number input changes (ensure numeric values)
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };
  
  // Handle feature updates
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };
  
  // Add a new feature field
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };
  
  // Remove a feature field
  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };
  
  // Handle specification updates
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
  };
  
  // Add a new specification field
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };
  
  // Remove a specification field
  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.stock.trim()) newErrors.stock = 'Stock is required';
    else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    
    // Validate each feature isn't empty
    const emptyFeatureIndex = formData.features.findIndex(f => !f.trim());
    if (emptyFeatureIndex !== -1) {
      newErrors.features = `Feature #${emptyFeatureIndex + 1} cannot be empty`;
    }
    
    // Validate specifications
    const emptySpecIndex = formData.specifications.findIndex(
      spec => !spec.key.trim() || !spec.value.trim()
    );
    if (emptySpecIndex !== -1) {
      newErrors.specifications = `Specification #${emptySpecIndex + 1} needs both key and value`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Format data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        warranty: parseInt(formData.warranty)
      };
      
      // In a real app, this would be an API call
      // if (isEditMode) {
      //   await sellerApi.updateProduct(id, productData);
      // } else {
      //   await sellerApi.createProduct(productData);
      // }
      
      // For demo purposes, just wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to products list
      navigate('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({
        submit: 'Failed to save product. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/seller/products');
  };
  
  if (loading) {
    return (
      <SellerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <p className="text-gray-500">Loading product data...</p>
          </div>
        </div>
      </SellerLayout>
    );
  }
  
  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-300' : ''}`}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Write a detailed description of your product including its condition and any important details.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.category ? 'border-red-300' : ''}`}
                    >
                      <option value="">Select a category</option>
                      <option value="Smartphones">Smartphones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Tablets">Tablets</option>
                      <option value="Desktops">Desktops</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Components">Components</option>
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Cameras">Cameras</option>
                      <option value="Gaming">Gaming</option>
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="refurbished">Refurbished</option>
                      <option value="used_like_new">Used - Like New</option>
                      <option value="used_good">Used - Good</option>
                      <option value="used_fair">Used - Fair</option>
                      <option value="for_parts">For Parts or Not Working</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleNumberChange}
                      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${errors.price ? 'border-red-300' : ''}`}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                    Original Price ($)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="originalPrice"
                      id="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleNumberChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Original retail price (for comparison)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="stock"
                      id="stock"
                      value={formData.stock}
                      onChange={handleNumberChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.stock ? 'border-red-300' : ''}`}
                      placeholder="0"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.brand ? 'border-red-300' : ''}`}
                    />
                    {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="model"
                      id="model"
                      value={formData.model}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.model ? 'border-red-300' : ''}`}
                    />
                    {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="sku"
                      id="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.sku ? 'border-red-300' : ''}`}
                    />
                    {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="warranty" className="block text-sm font-medium text-gray-700">
                    Warranty (months)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="warranty"
                      id="warranty"
                      value={formData.warranty}
                      onChange={handleNumberChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Product Features</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add the key features of your product
              </p>
              
              <div className="mt-4 space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder={`Feature #${index + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-3 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={formData.features.length === 1}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
                
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Feature
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Product Specifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add technical specifications for your product
              </p>
              
              <div className="mt-4 space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Specification name"
                      />
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Specification value"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={formData.specifications.length === 1}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {errors.specifications && <p className="mt-1 text-sm text-red-600">{errors.specifications}</p>}
                
                <button
                  type="button"
                  onClick={addSpecification}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Specification
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Product Images</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload clear images of your product from multiple angles
              </p>
              
              <div className="mt-4">
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden">
                          <div className="flex items-center justify-center h-full text-gray-500">
                            Image {index + 1}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default ProductFormPage;