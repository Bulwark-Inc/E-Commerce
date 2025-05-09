const Select = ({ label, id, options, className = '', ...props }) => (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default Select;
  