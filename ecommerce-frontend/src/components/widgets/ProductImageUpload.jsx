import { useState } from 'react';

const ProductImageUpload = ({ onUpload, isSubmitting }) => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    onUpload(formData);
  };

  return (
    <div className="space-y-3">
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        className="border p-2 rounded" 
      />
      <button
        onClick={handleUpload}
        disabled={!file || isSubmitting}
        className="bg-green-600 px-4 py-2 rounded text-white"
      >
        {isSubmitting ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ProductImageUpload;
