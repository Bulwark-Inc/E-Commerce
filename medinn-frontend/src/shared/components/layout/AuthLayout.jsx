const AuthWrapper = ({ title, children }) => (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
      {children}
    </div>
  );
  
  export default AuthWrapper;
  