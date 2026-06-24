import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MovieDocument } from './schemas/movie.schema';
export declare class SyncService implements OnApplicationBootstrap {
    private readonly movieModel;
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(movieModel: Model<MovieDocument>, httpService: HttpService, configService: ConfigService);
    onApplicationBootstrap(): Promise<void>;
    handleDailyCron(): Promise<void>;
    syncAll(): Promise<void>;
    private fetchAndSaveFromTMDB;
    private cleanup;
    private slugify;
    private syncMockData;
}
