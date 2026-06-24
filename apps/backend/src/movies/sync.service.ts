import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class SyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Application bootstrap: Starting initial TMDB movie sync...');
    await this.syncAll();
  }

  @Cron('0 0 * * *', { timeZone: 'Asia/Ho_Chi_Minh' })
  async handleDailyCron() {
    this.logger.log('Cron Job: Triggering daily TMDB movie sync...');
    await this.syncAll();
  }

  async syncAll() {
    try {
      const apiKey = this.configService.get<string>('TMDB_API_KEY');
      
      if (!apiKey) {
        this.logger.warn('TMDB_API_KEY is not defined in .env. Using mock seeding fallback...');
        await this.syncMockData();
        return;
      }

      this.logger.log('Syncing "Now Playing" movies from TMDB...');
      const nowPlayingIds = await this.fetchAndSaveFromTMDB('now_playing', 'NOW_PLAYING', apiKey);

      this.logger.log('Syncing "Upcoming" movies from TMDB...');
      await this.fetchAndSaveFromTMDB('upcoming', 'UPCOMING', apiKey);

      this.logger.log('Running cleanup to archive older movies...');
      await this.cleanup(nowPlayingIds);

      this.logger.log('TMDB movie sync completed successfully!');
    } catch (error) {
      this.logger.error('Error during TMDB movie sync:', error.message);
      this.logger.warn('Sync failed. Attempting mock seeding fallback to ensure application availability...');
      await this.syncMockData();
    }
  }

  private async fetchAndSaveFromTMDB(
    endpoint: 'now_playing' | 'upcoming',
    status: 'NOW_PLAYING' | 'UPCOMING',
    apiKey: string,
  ): Promise<number[]> {
    const url = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${apiKey}&region=VN&language=en-US&page=1`;
    const response = await firstValueFrom(this.httpService.get(url));
    const results = response.data?.results || [];
    const savedIds: number[] = [];

    for (const item of results) {
      if (!item.id || !item.title) continue;

      const slug = this.slugify(item.title) + '-' + item.id;
      const posterUrl = item.poster_path 
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400';

      await this.movieModel.findOneAndUpdate(
        { tmdbId: item.id },
        {
          title: item.title,
          slug,
          posterUrl,
          overview: item.overview || 'No description available.',
          releaseDate: item.release_date || new Date().toISOString().split('T')[0],
          status,
        },
        { upsert: true, new: true },
      ).exec();

      savedIds.push(item.id);
    }

    return savedIds;
  }

  private async cleanup(activeNowPlayingIds: number[]) {
    // Find movies currently marked NOW_PLAYING that were not in the latest now_playing TMDB list
    // and mark them as ARCHIVED
    await this.movieModel.updateMany(
      {
        status: 'NOW_PLAYING',
        tmdbId: { $nin: activeNowPlayingIds },
      },
      {
        status: 'ARCHIVED',
      },
    ).exec();
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  }

  private async syncMockData() {
    this.logger.log('Syncing mock movie data...');

    const mockMovies = [
      {
        tmdbId: 968051,
        title: 'Dune: Part Two',
        slug: 'dune-part-two-968051',
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
        overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        releaseDate: '2024-03-01',
        status: 'NOW_PLAYING' as const,
        hasAfterCredit: true,
        afterCreditVotes: 12,
      },
      {
        tmdbId: 823464,
        title: 'Godzilla x Kong: The New Empire',
        slug: 'godzilla-x-kong-the-new-empire-823464',
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
        overview: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island mysteries.',
        releaseDate: '2024-03-29',
        status: 'NOW_PLAYING' as const,
        hasAfterCredit: false,
        afterCreditVotes: 1,
      },
      {
        tmdbId: 1022789,
        title: 'Inside Out 2',
        slug: 'inside-out-2-1022789',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
        overview: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!',
        releaseDate: '2024-06-14',
        status: 'NOW_PLAYING' as const,
        hasAfterCredit: true,
        afterCreditVotes: 24,
      },
      {
        tmdbId: 1234567,
        title: 'Mai',
        slug: 'mai-1234567',
        posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
        overview: 'Mai, an independent and resilient woman, meets Duong, a young and free-spirited musician, leading to a moving romance that challenges societal structures.',
        releaseDate: '2024-02-10',
        status: 'NOW_PLAYING' as const,
        hasAfterCredit: false,
        afterCreditVotes: 0,
      },
      {
        tmdbId: 609681,
        title: 'Captain America: Brave New World',
        slug: 'captain-america-brave-new-world-609681',
        posterUrl: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=400',
        overview: 'Sam Wilson, the new Captain America, finds himself in the middle of an international incident as he must uncover the motive behind a nefarious global conspiracy.',
        releaseDate: '2025-02-14',
        status: 'UPCOMING' as const,
        hasAfterCredit: false,
        afterCreditVotes: 0,
      },
      {
        tmdbId: 889737,
        title: 'Joker: Folie à Deux',
        slug: 'joker-folie-a-deux-889737',
        posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400',
        overview: 'The musical thriller sequel follows Arthur Fleck as he shares a chaotic journey through madness, romance, and performance alongside Harley Quinn.',
        releaseDate: '2024-10-04',
        status: 'UPCOMING' as const,
        hasAfterCredit: false,
        afterCreditVotes: 0,
      },
    ];

    for (const movie of mockMovies) {
      await this.movieModel.findOneAndUpdate(
        { tmdbId: movie.tmdbId },
        movie,
        { upsert: true, new: true },
      ).exec();
    }

    this.logger.log('Mock movie data seeded successfully!');
  }
}
