import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminProduct } from '../context/AdminProductContext';
import { useProduct } from '../context/ProductContext';
import productService from '../services/productService';

const useAdminProductForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const { createProduct, updateProduct } = useAdminProduct();
  const { categories, fetchCategories } = useProduct();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    old_price: '',
    category: '',
    is_available: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await productService.getBySlug(slug);
          const product = res.data;
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            old_price: product.old_price || '',
            category: product.category?.slug || '',
            is_available: product.is_available,
          });
        } catch (err) {
          console.error('Failed to fetch product:', err);
          toast.error('Could not load product details.');
          navigate('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [slug, isEdit, fetchCategories, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price) {
      toast.error('Title, category, and price are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        await updateProduct(slug, formData);
        toast.success('Product updated!');
      } else {
        const newProduct = await createProduct(formData);
        toast.success('Product created!');
        navigate(`/admin/products/edit/${newProduct.slug}`);
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      setError('Failed to submit form.');
      toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    isEdit,
    error,
    categories,
  };
};

export default useAdminProductForm;
