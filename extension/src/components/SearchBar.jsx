import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  const handleShuffle = () => {
    onSearch('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          className="w-full bg-gray-800 text-white rounded-full py-3 px-6 pl-6 pr-20 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg placeholder-gray-400 transition-all font-sans"
          placeholder="Describe a vibe..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-2 flex gap-1">
          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"
            title="Search"
          >
            🔍
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            className="p-2 bg-purple-600 hover:bg-purple-500 rounded-full text-white transition-colors"
            title="Random Masterpiece"
          >
            🎲
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
