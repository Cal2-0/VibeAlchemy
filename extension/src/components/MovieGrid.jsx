import React from 'react';

const MovieGrid = ({ movies, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <p>No vibes detailed yet. Try searching or shuffling!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-2 overflow-y-auto max-h-[500px] scrollbar-hide">
      {movies.map((movie, index) => (
        <div
          key={index}
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(movie.title + " movie")}`, '_blank')}
          className="relative group aspect-[2/3] rounded-lg overflow-hidden cursor-pointer shadow-md bg-gray-800 transition-transform duration-300 hover:scale-[1.02] hover:z-10"
        >
          <div className="absolute top-2 right-2 z-20 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white">↗</span>
          </div>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x450?text=No+Poster"; }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            <h3 className="text-white font-bold text-sm mb-1">{movie.title}</h3>
            <span className="text-purple-400 text-xs font-semibold mb-2">{movie.year}</span>
            <p className="text-gray-300 text-xs line-clamp-4">{movie.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
