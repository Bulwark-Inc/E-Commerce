import { useState, useEffect } from 'react';
import { useAdminProduct } from '../../context/AdminProductContext';
import { useParams } from 'react-router-dom';  // Import useParams to get slug from URL
import ProductImageUpload from '../../components/widgets/ProductImageUpload';
import toast from 'react-hot-toast';

const AdminProductImagesPage = () => {
  const { addProductImage } = useAdminProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { slug } = useParams();  // Use useParams to get the slug from URL

  // Make sure the slug is available before proceeding
  if (!slug) {
    return <div>Error: Product slug is missing!</div>;
  }

  const handleUpload = async (formData) => {
    setIsSubmitting(true);
    try {
      // Make sure to use the correct API endpoint format
      await addProductImage(slug, formData);
      toast.success('Image uploaded.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Upload Product Images</h1>
      <ProductImageUpload onUpload={handleUpload} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AdminProductImagesPage;
