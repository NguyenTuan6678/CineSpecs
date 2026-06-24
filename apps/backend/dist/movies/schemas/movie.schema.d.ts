import { Document } from 'mongoose';
export type MovieDocument = Movie & Document;
export declare class Movie {
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
export declare const MovieSchema: import("mongoose").Schema<Movie, import("mongoose").Model<Movie, any, any, any, any, any, Movie>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Movie, Document<unknown, {}, Movie, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tmdbId?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    posterUrl?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    overview?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    releaseDate?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"NOW_PLAYING" | "UPCOMING" | "ARCHIVED", Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hasAfterCredit?: import("mongoose").SchemaDefinitionProperty<boolean, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    afterCreditVotes?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Movie>;
