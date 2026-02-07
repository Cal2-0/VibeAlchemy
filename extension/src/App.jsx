import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVibe, setLastVibe] = useState('');

  // Initial "Surprise Me" load
  useEffect(() => {
    handleSearch('', true);
  }, []);

  const handleSearch = async (vibe, isNewSearch = true) => {
    setLoading(true);
    setError(null);

    // If it's a new search, clear old movies. If loading more, keep them.
    if (isNewSearch) {
      setMovies([]);
      setLastVibe(vibe); // Update last vibe only on new search
    } else {
      // Validation: Don't load more if we don't have a vibe (unless it was random/empty)
      vibe = lastVibe;
    }

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe }),
      });

      const data = await response.json();
      if (data.movies && data.movies.length > 0) {
        setMovies(prevMovies => {
          if (isNewSearch) return data.movies;
          // Deduplicate: Filter out movies that are already in the list
          const existingTitles = new Set(prevMovies.map(m => m.title.toLowerCase()));
          const newUniqueMovies = data.movies.filter(m => !existingTitles.has(m.title.toLowerCase()));
          return [...prevMovies, ...newUniqueMovies];
        });
      } else {
        if (isNewSearch) setError("No movies found. Try a different vibe!");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Could not connect to Brain. Is 'python app.py' running?");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    handleSearch(lastVibe, false);
  };

  return (
    <div className="w-[400px] h-[600px] bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex flex-col overflow-hidden font-sans border border-gray-700 shadow-2xl">
      {/* Header */}
      <header className="py-4 bg-black/40 backdrop-blur-md sticky top-0 z-10 border-b border-white/10 relative">
        <h1 className="text-center text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-widest uppercase drop-shadow-sm">
          VibeAlchemy
        </h1>
        {/* Context Match Button */}
        <button
          onClick={() => {
            if (window.chrome && chrome.tabs) {
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTab = tabs[0];
                if (activeTab && activeTab.title) {
                  // Simple cleanup: remove standard suffixes
                  let title = activeTab.title.replace(" - Netflix", "").replace(" - IMDb", "").replace(" - Prime Video", "").replace(" | Disney+", "");
                  // Take first 3 words if too long? No, rely on title.
                  handleSearch("Movies like " + title, true);
                }
              });
            } else {
              setError("Context search only works in Chrome Extension mode.");
            }
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md border border-white/20 transition-all"
          title="Match Vibe of Current Tab"
        >
          📺 Match Tab
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-b from-black/20 to-transparent p-2">
          <SearchBar onSearch={(vibe) => handleSearch(vibe, true)} />
        </div>

        {/* Error Info */}
        {error && (
          <div className="p-4 text-center animate-pulse">
            <p className="text-red-300 bg-red-900/40 p-3 rounded-lg border border-red-500/30 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
          <MovieGrid movies={movies} loading={loading && movies.length === 0} />

          {/* Load More Button (Only show if we have movies and aren't loading initial state) */}
          {movies.length > 0 && (
            <div className="flex justify-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                    Loading...
                  </>
                ) : (
                  "✨ Load More Vibes"
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 text-center text-[10px] text-gray-500 bg-black/80 border-t border-white/5 backdrop-blur-sm">
        Powered by Apriel 1.6 Thinker & TMDB
      </footer>
    </div>
  );
}

export default App;
