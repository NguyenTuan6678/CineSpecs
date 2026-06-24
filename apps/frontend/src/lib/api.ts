export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
}

export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  slug: string;
  posterUrl: string;
  overview: string;
  releaseDate: string;
  status: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED';
  hasAfterCredit: boolean;
  afterCreditVotes: number;
}

export interface Review {
  _id: string;
  userId: User;
  movieId: string;
  storyScore: number;
  visualScore: number;
  actingScore: number;
  averageScore: number;
  content: string;
  hasSpoiler: boolean;
  isReported: boolean;
  reportCount: number;
  createdAt: string;
}

export async function fetchMovies(status?: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED'): Promise<Movie[]> {
  try {
    const url = new URL(`${API_BASE_URL}/movies`);
    if (status) {
      url.searchParams.append('status', status);
    }
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch movies');
    return await res.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function fetchMovieBySlug(slug: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching movie details for ${slug}:`, error);
    return null;
  }
}

export async function voteAfterCredit(movieId: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}/after-credit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to submit after-credit vote');
    return await res.json();
  } catch (error) {
    console.error(`Error voting after-credit for ${movieId}:`, error);
    return null;
  }
}

export async function fetchMovieReviews(movieId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}/reviews`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching reviews for movie ${movieId}:`, error);
    return [];
  }
}

export async function createReview(reviewData: {
  userId: string;
  movieId: string;
  storyScore: number;
  visualScore: number;
  actingScore: number;
  content: string;
  hasSpoiler?: boolean;
}): Promise<Review | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return await res.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    return null;
  }
}

export async function reportReview(reviewId: string): Promise<Review | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to report review');
    return await res.json();
  } catch (error) {
    console.error(`Error reporting review ${reviewId}:`, error);
    return null;
  }
}

export async function findOrCreateUser(userData: {
  email: string;
  name: string;
  avatar?: string;
  role?: 'USER' | 'ADMIN';
}): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/find-or-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to authenticate user');
    return await res.json();
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    return null;
  }
}
