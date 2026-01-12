import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const Search = () => {
  const [word, setWord] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your search logic here
    console.log("Searching for:", word);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl h-12 bg-gray-50 rounded-xl 
      border border-gray-100 hover:border-gray-200 transition-all duration-300 
      flex items-center focus-within:bg-white focus-within:border-blue-300 
      focus-within:shadow-sm"
    >
      <button
        type="submit"
        className="absolute left-4 text-gray-500 hover:text-blue-500 
        transition-colors duration-200"
      >
        <FiSearch className="text-xl" />
      </button>
      
      <input
        type="text"
        className="w-full h-full pl-12 pr-4 outline-none bg-transparent 
        text-gray-800 placeholder-gray-500 text-sm md:text-base"
        placeholder="Search anything..."
        value={word}
        onChange={(e) => {
          setWord(e.target.value);
        }}
      />
      
      {word && (
        <button
          type="button"
          onClick={() => setWord("")}
          className="absolute right-4 text-gray-400 hover:text-gray-600 
          transition-colors duration-200"
        >
          ✕
        </button>
      )}
    </form>
  );
};

export default Search;