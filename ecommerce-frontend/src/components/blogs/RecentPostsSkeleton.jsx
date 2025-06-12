const RecentPostsSkeleton = () => (
  <ul className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <li key={i} className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
    ))}
  </ul>
);

export default RecentPostsSkeleton;
