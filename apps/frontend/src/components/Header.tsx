'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Film, Loader2, User as UserIcon, LogOut, Check, ChevronDown } from 'lucide-react';
import { fetchMovies, findOrCreateUser, Movie, User } from '@/lib/api';

export default function Header() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  // Form States for Custom Login
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<'USER' | 'ADMIN'>('USER');

  useEffect(() => {
    // Load movies for search index
    const loadMovies = async () => {
      setLoading(true);
      const data = await fetchMovies('NOW_PLAYING');
      const upcoming = await fetchMovies('UPCOMING');
      setMovies([...data, ...upcoming]);
      setLoading(false);
    };
    loadMovies();

    // Check localStorage for active session
    const stored = localStorage.getItem('cinespecs_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('cinespecs_user');
      }
    }

    // Listen to local storage events for authentication updates
    const handleAuthChange = () => {
      const updated = localStorage.getItem('cinespecs_user');
      setCurrentUser(updated ? JSON.parse(updated) : null);
    };
    window.addEventListener('cinespecs_auth_change', handleAuthChange);
    return () => window.removeEventListener('cinespecs_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredMovies([]);
      return;
    }
    const filtered = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.overview.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredMovies(filtered.slice(0, 5));
  }, [query, movies]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (name: string, role: 'USER' | 'ADMIN') => {
    const formattedEmail = `${name.toLowerCase().replace(/\s+/g, '')}@cinespecs.com`;
    const user = await findOrCreateUser({
      email: formattedEmail,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    });

    if (user) {
      localStorage.setItem('cinespecs_user', JSON.stringify(user));
      setCurrentUser(user);
      window.dispatchEvent(new Event('cinespecs_auth_change'));
      setIsAuthOpen(false);
      // Reset form
      setCustomName('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cinespecs_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('cinespecs_auth_change'));
    setIsAuthOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-amber-600 shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform duration-200">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight">
              CINE<span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">SPECS</span>
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm mx-4 flex-1 md:flex-none">
          <div className="relative group">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full h-9 rounded-full bg-zinc-900 border border-zinc-800 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all duration-200"
            />
            {loading && (
              <Loader2 className="absolute top-2.5 right-3 h-4 w-4 animate-spin text-zinc-500" />
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && query.trim() !== '' && (
            <div className="absolute right-0 left-0 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/80 py-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 tracking-wider uppercase border-b border-zinc-850">
                Movies ({filteredMovies.length})
              </div>
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <button
                    key={movie._id}
                    onClick={() => {
                      router.push(`/movie/${movie.slug}`);
                      setIsSearchOpen(false);
                      setQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-850/50 text-left transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-10 w-7 rounded object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-200 leading-tight">{movie.title}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">Released: {movie.releaseDate}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-sm text-zinc-500">
                  No movies found for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Authentication Options Dropdown */}
        <div ref={authRef} className="relative">
          {currentUser ? (
            <button
              onClick={() => setIsAuthOpen(!isAuthOpen)}
              className="flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 pl-1.5 pr-3 py-1 hover:border-zinc-700 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-6.5 w-6.5 rounded-full object-cover bg-zinc-850 border border-zinc-700"
              />
              <span className="hidden sm:inline text-xs font-semibold text-zinc-200">{currentUser.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(!isAuthOpen)}
              className="flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 rounded-full transition-all shadow-md active:scale-98"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}

          {isAuthOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4 space-y-4">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-850">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-10 w-10 rounded-full border border-zinc-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{currentUser.name}</h4>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 rounded-xl transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-3.5">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Quick Sign-In
                  </div>

                  {/* Preset accounts */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleLogin('System Admin', 'ADMIN')}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl bg-zinc-950 hover:bg-zinc-850 text-xs font-semibold text-zinc-200 border border-zinc-850 transition-colors"
                    >
                      <span>System Admin (Admin)</span>
                      <Check className="h-3.5 w-3.5 text-amber-500" />
                    </button>
                    <button
                      onClick={() => handleLogin('An Nguyen', 'USER')}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl bg-zinc-950 hover:bg-zinc-850 text-xs font-semibold text-zinc-200 border border-zinc-850 transition-colors"
                    >
                      <span>An Nguyen (User)</span>
                      <Check className="h-3.5 w-3.5 text-zinc-500" />
                    </button>
                  </div>

                  {/* Custom login form */}
                  <div className="border-t border-zinc-850 pt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Or enter name..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full h-8 px-3 rounded-lg bg-zinc-950 border border-zinc-850 text-xs text-zinc-200 focus:outline-none focus:border-red-500/50"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500">Role:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomRole('USER')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            customRole === 'USER' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-zinc-500'
                          }`}
                        >
                          User
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomRole('ADMIN')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            customRole === 'ADMIN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-500'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => customName.trim() && handleLogin(customName.trim(), customRole)}
                      disabled={!customName.trim()}
                      className="w-full py-1.5 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-xl transition-all"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
