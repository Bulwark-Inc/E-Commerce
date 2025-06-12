const PostDetail = ({ post }) => (
  <article className="prose lg:prose-xl mx-auto">
    <img
      src={post.featured_image}
      alt={post.title}
      className="w-full h-80 object-cover rounded mb-6"
    />
    <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
    <p className="text-gray-600 text-sm mb-4">
      By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
    </p>
    <div dangerouslySetInnerHTML={{ __html: post.content }} />
    <div className="mt-8">
      <strong>Categories:</strong>
      <div className="flex flex-wrap mt-2 space-x-3">
        {post.categories.map((cat) => (
          <span key={cat.id} className="text-blue-600">{cat.name}</span>
        ))}
      </div>
      <strong className="block mt-4">Tags:</strong>
      <div className="flex flex-wrap mt-2 space-x-3">
        {post.tags.map((tag) => (
          <span key={tag.id} className="text-gray-600">#{tag.name}</span>
        ))}
      </div>
    </div>
  </article>
);

export default PostDetail;
