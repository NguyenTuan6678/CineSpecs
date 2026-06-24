import { notFound } from 'next/navigation';
import { fetchMovieBySlug } from '@/lib/api';
import MovieDetailClient from '@/components/MovieDetailClient';

export const revalidate = 60; // ISR cache revalidation (60 seconds)

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const movie = await fetchMovieBySlug(slug);
  if (!movie) {
    notFound();
  }

  return <MovieDetailClient movie={movie} />;
}
