'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Play, Star, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { fetchMovies, Movie } from '@/lib/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'NOW_PLAYING' | 'UPCOMING'>('NOW_PLAYING');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const data = await fetchMovies(activeTab);
      setMovies(data);
      setLoading(false);
    };
    loadMovies();
  }, [activeTab]);

  // Find a movie to feature on the Hero Banner
  const featuredMovie = activeTab === 'NOW_PLAYING' && movies.length > 0 ? movies[0] : null;

  return (
    <div className="relative isolate min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background cinematic glows */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-600 to-amber-600 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-12">
        {/* Hero / Featured Banner Section */}
        {featuredMovie ? (
          <div className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-900/10 backdrop-blur-md p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row gap-8 items-center min-h-[400px]">
            {/* Blur backdrop image */}
            <div className="absolute inset-0 -z-10 opacity-10 blur-2xl scale-110 select-none pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredMovie.posterUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Left: Poster */}
            <div className="relative w-44 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 shadow-black/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredMovie.posterUrl}
                alt={featuredMovie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                <Sparkles className="h-3 w-3" />
                <span>Featured Release</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {featuredMovie.title}
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
                {featuredMovie.overview}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-zinc-500">
                <span>Release Date: {featuredMovie.releaseDate}</span>
                {featuredMovie.hasAfterCredit && (
                  <span className="text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded-md">
                    🚨 Has After-Credit
                  </span>
                )}
              </div>
              <div className="pt-2">
                <Link
                  href={`/movie/${featuredMovie.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 px-6 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-red-600/10 active:scale-98"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Explore & Write Review</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Simple Standard Hero if nothing featured */
          <div className="text-center py-12 sm:py-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              CineSpecs <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">Reviews</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">
              Explore multi-dimensional reviews on script structure, visuals, acting, and check if movies contain after-credit scenes.
            </p>
          </div>
        )}

        {/* Tab & Filter Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('NOW_PLAYING')}
                className={`text-sm sm:text-base font-bold pb-4 -mb-4 border-b-2 transition-all relative ${
                  activeTab === 'NOW_PLAYING'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Now Playing
              </button>
              <button
                onClick={() => setActiveTab('UPCOMING')}
                className={`text-sm sm:text-base font-bold pb-4 -mb-4 border-b-2 transition-all relative ${
                  activeTab === 'UPCOMING'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Upcoming Releases
              </button>
            </div>
          </div>

          {/* Grid display */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] w-full rounded-2xl bg-zinc-900" />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/movie/${movie.slug}`}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900/30 border border-zinc-900 hover:border-red-500/30 hover:bg-zinc-900/55 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Poster Container */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="object-cover w-full h-full scale-100 group-hover:scale-103 transition-all duration-500"
                    />
                    
                    {/* After-credit Indicator Badge */}
                    {movie.hasAfterCredit && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 backdrop-blur-md">
                          🚨 After-Credit
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Info Panel */}
                  <div className="p-4 relative z-20 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {movie.releaseDate}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-zinc-850 rounded-2xl flex flex-col items-center">
              <AlertCircle className="h-8 w-8 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-400">No movies found in this tab.</p>
              <p className="text-xs text-zinc-500 mt-1">Make sure MONGODB is connected or run the dynamic-seeder.ts script.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
