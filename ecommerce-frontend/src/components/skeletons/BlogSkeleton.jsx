const BlogSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse border rounded-lg p-4">
          <div className="bg-gray-300 h-48 mb-4" />
          <div className="h-6 bg-gray-300 mb-2 rounded" />
          <div className="h-4 bg-gray-300 mb-2 rounded w-2/3" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;
