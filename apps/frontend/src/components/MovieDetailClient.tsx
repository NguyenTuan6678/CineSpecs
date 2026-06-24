'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MessageSquare, PlusCircle, X, ShieldAlert, Sparkles, AlertTriangle, Flag, ThumbsUp } from 'lucide-react';
import { Movie, Review, User, fetchMovieReviews, createReview, reportReview, voteAfterCredit } from '@/lib/api';

interface MovieDetailClientProps {
  movie: Movie;
}

export default function MovieDetailClient({ movie: initialMovie }: MovieDetailClientProps) {
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth Context
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Review Form States
  const [storyScore, setStoryScore] = useState(5);
  const [visualScore, setVisualScore] = useState(5);
  const [actingScore, setActingScore] = useState(5);
  const [comment, setComment] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // UI state for revealing individual spoiler cards
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());
  const [hasVotedAfterCredit, setHasVotedAfterCredit] = useState(false);

  // Sync auth with localStorage
  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('cinespecs_user');
      setCurrentUser(stored ? JSON.parse(stored) : null);
    };
    checkAuth();
    window.addEventListener('cinespecs_auth_change', checkAuth);
    return () => window.removeEventListener('cinespecs_auth_change', checkAuth);
  }, []);

  // Fetch reviews for this movie
  const loadReviews = async () => {
    setLoadingReviews(true);
    const data = await fetchMovieReviews(movie._id);
    setReviews(data);
    setLoadingReviews(false);
  };

  useEffect(() => {
    loadReviews();
  }, [movie._id]);

  // Aggregate ratings
  const ratingsSummary = useMemo(() => {
    if (reviews.length === 0) {
      return {
        story: 0,
        visual: 0,
        acting: 0,
        average: 0,
        total: 0,
      };
    }
    const total = reviews.length;
    const storySum = reviews.reduce((sum, r) => sum + r.storyScore, 0);
    const visualSum = reviews.reduce((sum, r) => sum + r.visualScore, 0);
    const actingSum = reviews.reduce((sum, r) => sum + r.actingScore, 0);

    return {
      story: Number((storySum / total).toFixed(1)),
      visual: Number((visualSum / total).toFixed(1)),
      acting: Number((actingSum / total).toFixed(1)),
      average: Number(((storySum + visualSum + actingSum) / (total * 3)).toFixed(1)),
      total,
    };
  }, [reviews]);

  const handleVoteAfterCredit = async () => {
    if (hasVotedAfterCredit) return;
    const updated = await voteAfterCredit(movie._id);
    if (updated) {
      setMovie(updated);
      setHasVotedAfterCredit(true);
    }
  };

  const handleReport = async (reviewId: string) => {
    const updated = await reportReview(reviewId);
    if (updated) {
      // If it became reported (hidden) or report count increased, reload reviews list
      loadReviews();
    }
  };

  const handleToggleSpoiler = (reviewId: string) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setSubmitError('You must be signed in to submit a review.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const res = await createReview({
      userId: currentUser._id,
      movieId: movie._id,
      storyScore,
      visualScore,
      actingScore,
      content: comment,
      hasSpoiler,
    });

    if (res) {
      // Reset & Reload
      setComment('');
      setHasSpoiler(false);
      setStoryScore(5);
      setVisualScore(5);
      setActingScore(5);
      setIsModalOpen(false);
      loadReviews();
    } else {
      setSubmitError('Failed to submit review. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Movie Hub
        </Link>

        {/* 1. UPPER PANEL: Movie Information */}
        <div className="rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 sm:p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
          {/* Blurred background glow */}
          <div className="absolute inset-0 -z-10 opacity-5 blur-3xl scale-120 select-none pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={movie.posterUrl} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Left: Poster */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 shadow-black/60 bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={movie.posterUrl} alt={movie.title} className="object-cover w-full h-full" />
          </div>

          {/* Right: Text Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold border ${
                  movie.status === 'NOW_PLAYING' 
                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {movie.status === 'NOW_PLAYING' ? 'Now Playing' : 'Upcoming'}
                </span>
                
                {/* Community After-Credit Badge */}
                {movie.hasAfterCredit && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 shadow-sm animate-pulse">
                    🚨 Phim CÓ After-credit
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              <p className="text-sm text-zinc-400 leading-relaxed">
                {movie.overview}
              </p>

              <div className="text-xs text-zinc-500 font-semibold space-y-1">
                <p>Release Date: <strong className="text-zinc-300">{movie.releaseDate}</strong></p>
                <p>After-Credit Votes: <strong className="text-zinc-300">{movie.afterCreditVotes} users confirmed</strong></p>
              </div>
            </div>

            {/* Voting block for After-credit */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-900 pt-6">
              <button
                onClick={handleVoteAfterCredit}
                disabled={hasVotedAfterCredit}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all border ${
                  hasVotedAfterCredit 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white active:scale-98'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{hasVotedAfterCredit ? 'Voted After-Credit!' : 'Confirm Movie Has After-Credit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. LOWER PORTION: Dashboard and Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Metric Dashboard */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-4">Experience Metrics</h2>
              
              {ratingsSummary.total > 0 ? (
                <div className="space-y-6">
                  {/* Rating Big Number */}
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-extrabold text-white tracking-tight">
                      {ratingsSummary.average.toFixed(1)}
                    </div>
                    <div>
                      <div className="flex text-amber-500 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4.5 w-4.5 ${
                              i < Math.round(ratingsSummary.average / 2) ? 'fill-amber-500' : 'text-zinc-750'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
                        Based on {ratingsSummary.total} reviews
                      </span>
                    </div>
                  </div>

                  {/* Dimension breakdown bars */}
                  <div className="space-y-3.5 border-t border-zinc-900 pt-4">
                    {/* Story Score */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                        <span>Story & Script</span>
                        <span className="text-zinc-300 font-bold">{ratingsSummary.story} / 10</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${ratingsSummary.story * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Visual Score */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                        <span>Visual Effects & Cinematography</span>
                        <span className="text-zinc-300 font-bold">{ratingsSummary.visual} / 10</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${ratingsSummary.visual * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Acting Score */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
                        <span>Acting & Cast Chemistry</span>
                        <span className="text-zinc-300 font-bold">{ratingsSummary.acting} / 10</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${ratingsSummary.acting * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-zinc-550 border border-dashed border-zinc-850 rounded-2xl">
                  No reviews submitted yet. Be the first to express your thoughts!
                </div>
              )}
            </div>

            {/* Write Review Button Panel */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 backdrop-blur-md text-center">
              <h3 className="text-sm font-bold text-zinc-300 mb-2">Share Your Perspective</h3>
              <p className="text-[11px] text-zinc-500 mb-4.5">
                Rate story, cinematography, and cast performances out of 10. You can toggle spoiler alerts.
              </p>
              
              {currentUser ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg active:scale-98"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Write Movie Review</span>
                </button>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-850 bg-zinc-950/40 p-4 text-xs text-zinc-400">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto mb-1.5" />
                  Please sign in from the header to write a review.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Reviews Feed list */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 backdrop-blur-md flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-900 pb-4">
                <MessageSquare className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-bold text-white">Reviews Feed ({reviews.length})</h3>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                {loadingReviews ? (
                  <div className="text-center py-12 text-xs text-zinc-500">
                    Loading reviews...
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((rev) => {
                    const isSpoiler = rev.hasSpoiler;
                    const isRevealed = revealedSpoilers.has(rev._id);

                    return (
                      <div
                        key={rev._id}
                        className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-4 hover:border-zinc-800 transition-colors relative"
                      >
                        {/* Header metadata */}
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={rev.userId?.avatar}
                              alt=""
                              className="h-7 w-7 rounded-full bg-zinc-850 border border-zinc-800"
                            />
                            <div>
                              <span className="text-xs font-bold text-zinc-200 block">
                                {rev.userId?.name || 'Anonymous User'}
                              </span>
                              <span className="text-[9px] text-zinc-550 block font-semibold uppercase">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Action Report Flag */}
                          <button
                            onClick={() => handleReport(rev._id)}
                            className="p-1 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Report review"
                          >
                            <Flag className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Rating Score Breakdown Badges */}
                        <div className="flex flex-wrap gap-2 text-[9px] font-extrabold uppercase mb-3.5">
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                            Story: {rev.storyScore}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Visual: {rev.visualScore}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Acting: {rev.actingScore}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 ml-auto font-black text-[10px]">
                            ★ {rev.averageScore.toFixed(1)}
                          </span>
                        </div>

                        {/* Review Content (handles Spoiler blur overlays) */}
                        {isSpoiler && !isRevealed ? (
                          <div className="relative rounded-xl overflow-hidden border border-red-500/25 bg-red-500/[0.02] p-4 text-center cursor-pointer hover:bg-red-500/[0.04] transition-colors"
                            onClick={() => handleToggleSpoiler(rev._id)}
                          >
                            {/* Blurred text content behind */}
                            <p className="text-xs text-zinc-500 select-none blur-[5px] filter leading-relaxed italic">
                              {rev.content}
                            </p>
                            {/* Overlay message */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                              <AlertTriangle className="h-5 w-5 text-red-400 mb-1" />
                              <span className="text-xs font-bold text-red-400">Tiết lộ nội dung (Spoiler)</span>
                              <span className="text-[9px] text-zinc-500 font-semibold mt-0.5">Click to reveal review</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/10 p-3 rounded-xl border border-zinc-900">
                              &ldquo;{rev.content}&rdquo;
                            </p>
                            {isSpoiler && (
                              <button
                                onClick={() => handleToggleSpoiler(rev._id)}
                                className="absolute bottom-2 right-3 text-[8px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded hover:bg-red-500/20 transition-all"
                              >
                                Hide Spoiler
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-xs text-zinc-600 border border-dashed border-zinc-850 rounded-2xl flex flex-col items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-zinc-700 mb-2" />
                    <span>Be the first to share your thoughts on this movie!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REVIEW DIALOG SUBMISSION MODAL */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Write Movie Review</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Sharing review for <strong className="text-red-400">{movie.title}</strong> as <strong>{currentUser.name}</strong>.
              </p>
            </div>

            {submitError && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2.5 text-xs text-red-400">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Score Input ranges */}
              <div className="space-y-3 border-b border-zinc-800 pb-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Assign Scores (1-10)</h4>
                
                {/* Story Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-400">
                    <span>Story & Writing</span>
                    <span className="text-red-400 font-bold">{storyScore}★</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={storyScore}
                    onChange={(e) => setStoryScore(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* Visual Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-400">
                    <span>Visuals & VFX</span>
                    <span className="text-amber-400 font-bold">{visualScore}★</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={visualScore}
                    onChange={(e) => setVisualScore(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Acting Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-400">
                    <span>Acting & Cast</span>
                    <span className="text-blue-400 font-bold">{actingScore}★</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={actingScore}
                    onChange={(e) => setActingScore(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Comment content */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Review Content</label>
                <textarea
                  rows={4}
                  placeholder="Describe character arcs, technical visual elements, or acting peaks/troughs..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500/50 resize-none"
                  required
                />
              </div>

              {/* Spoiler flag checkbox */}
              <div className="flex items-center gap-2 py-1.5">
                <input
                  type="checkbox"
                  id="spoiler"
                  checked={hasSpoiler}
                  onChange={(e) => setHasSpoiler(e.target.checked)}
                  className="w-4.5 h-4.5 bg-zinc-950 border border-zinc-850 rounded text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="spoiler" className="text-xs font-bold text-red-400 cursor-pointer select-none">
                  ⚠️ Bài viết của tôi có tiết lộ nội dung quan trọng (Spoiler)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
