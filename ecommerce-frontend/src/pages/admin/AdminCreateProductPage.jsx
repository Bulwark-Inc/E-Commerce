import AdminProductForm from "../../components/forms/AdminProductForm";

const AdminCreateProductPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Product</h1>
      <AdminProductForm onSuccess={() => {}} />
    </div>
  );
};

export default AdminCreateProductPage;
