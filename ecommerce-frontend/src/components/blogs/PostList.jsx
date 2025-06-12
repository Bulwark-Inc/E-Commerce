import PostCard from './PostCard';

const PostList = ({ posts }) => {
  if (!posts.length) return <p className="text-gray-500">No blog posts available.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
