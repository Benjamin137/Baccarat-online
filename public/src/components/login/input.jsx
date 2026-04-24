


const Input = ({ label, type, value, onChange, placeholder, id }) => {
  return (
    <div className="relative mt-6">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-white/20 text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all placeholder-transparent"
      />
      
      <label
        htmlFor={id}
        className="absolute left-2 -top-3 px-1 text-sm text-yellow-400 transition-all 
                   
                   peer-placeholder-shown:text-base 
                   peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:top-3
                   peer-placeholder-shown: left-2
                   peer-focus:-top-8 
                   peer-focus:text-sm 
                   peer-focus:text-yellow-400
                   pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;