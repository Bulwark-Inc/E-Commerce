import { useEffect } from "react";
import { useProduct } from "../../context/ProductContext";
import { useParams } from "react-router-dom";
import AdminProductForm from "../../components/forms/AdminProductForm";

const AdminEditProductPage = () => {
  const { product, fetchProduct } = useProduct();
  const { slug } = useParams();

  useEffect(() => {
    fetchProduct(slug);
  }, [slug]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Product</h1>
      <AdminProductForm initialData={product} onSuccess={() => {}} />
    </div>
  );
};

export default AdminEditProductPage;
