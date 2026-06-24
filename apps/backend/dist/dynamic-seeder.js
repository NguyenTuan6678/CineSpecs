"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const movie_schema_1 = require("./movies/schemas/movie.schema");
const user_schema_1 = require("./users/schemas/user.schema");
const review_schema_1 = require("./reviews/schemas/review.schema");
dotenv.config({ path: path.join(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME || 'CineSpecs';
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables.');
    process.exit(1);
}
async function run() {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_NAME });
    console.log('Connected to database:', MONGODB_NAME);
    const MovieModel = mongoose.model('Movie', movie_schema_1.MovieSchema);
    const UserModel = mongoose.model('User', user_schema_1.UserSchema);
    const ReviewModel = mongoose.model('Review', review_schema_1.ReviewSchema);
    console.log('Clearing old collections...');
    await MovieModel.deleteMany({});
    await UserModel.deleteMany({});
    await ReviewModel.deleteMany({});
    console.log('Seeding Users...');
    const users = await UserModel.create([
        {
            email: 'admin@cinespecs.com',
            name: 'System Admin',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
            role: 'ADMIN',
        },
        {
            email: 'an.nguyen@example.com',
            name: 'An Nguyen',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=An',
            role: 'USER',
        },
        {
            email: 'binh.tran@example.com',
            name: 'Binh Tran',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Binh',
            role: 'USER',
        },
        {
            email: 'chi.le@example.com',
            name: 'Chi Le',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chi',
            role: 'USER',
        },
        {
            email: 'dung.vu@example.com',
            name: 'Dung Vu',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dung',
            role: 'USER',
        },
        {
            email: 'emily.smith@example.com',
            name: 'Emily Smith',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emily',
            role: 'USER',
        },
    ]);
    console.log('Seeding Movies...');
    const movies = await MovieModel.create([
        {
            tmdbId: 968051,
            title: 'Dune: Part Two',
            slug: 'dune-part-two-968051',
            posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
            overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
            releaseDate: '2024-03-01',
            status: 'NOW_PLAYING',
            hasAfterCredit: true,
            afterCreditVotes: 15,
        },
        {
            tmdbId: 823464,
            title: 'Godzilla x Kong: The New Empire',
            slug: 'godzilla-x-kong-the-new-empire-823464',
            posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
            overview: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins.',
            releaseDate: '2024-03-29',
            status: 'NOW_PLAYING',
            hasAfterCredit: false,
            afterCreditVotes: 1,
        },
        {
            tmdbId: 1022789,
            title: 'Inside Out 2',
            slug: 'inside-out-2-1022789',
            posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
            overview: 'Riley\'s mind headquarters is undergoing a sudden demolition to make room for new Emotions, including Anxiety.',
            releaseDate: '2024-06-14',
            status: 'NOW_PLAYING',
            hasAfterCredit: true,
            afterCreditVotes: 28,
        },
        {
            tmdbId: 1234567,
            title: 'Mai',
            slug: 'mai-1234567',
            posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
            overview: 'Mai, an independent woman, meets a young musician leading to a moving romance that challenges societal values.',
            releaseDate: '2024-02-10',
            status: 'NOW_PLAYING',
            hasAfterCredit: false,
            afterCreditVotes: 0,
        },
        {
            tmdbId: 533535,
            title: 'Deadpool & Wolverine',
            slug: 'deadpool-wolverine-533535',
            posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400',
            overview: 'A listless Wade Wilson toils in civilian life until a threat to his home universe forces him to team up with Wolverine.',
            releaseDate: '2024-07-26',
            status: 'NOW_PLAYING',
            hasAfterCredit: true,
            afterCreditVotes: 42,
        },
        {
            tmdbId: 609681,
            title: 'Captain America: Brave New World',
            slug: 'captain-america-brave-new-world-609681',
            posterUrl: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=400',
            overview: 'Sam Wilson, the new Captain America, finds himself in the middle of a dangerous international incident.',
            releaseDate: '2025-02-14',
            status: 'UPCOMING',
            hasAfterCredit: false,
            afterCreditVotes: 0,
        },
        {
            tmdbId: 889737,
            title: 'Joker: Folie à Deux',
            slug: 'joker-folie-a-deux-889737',
            posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400',
            overview: 'Arthur Fleck shares a chaotic journey through madness, romance, and performance alongside Harley Quinn.',
            releaseDate: '2024-10-04',
            status: 'UPCOMING',
            hasAfterCredit: false,
            afterCreditVotes: 0,
        },
    ]);
    console.log('Seeding Reviews...');
    const reviewContents = [
        {
            movieIndex: 0,
            userIndex: 1,
            story: 9,
            visual: 10,
            acting: 9,
            content: 'Incredible visuals and soundtrack. Villeneuve masterfully adapted Herbert\'s world. Timothée and Zendaya have great chemistry.',
            hasSpoiler: false,
        },
        {
            movieIndex: 0,
            userIndex: 2,
            story: 8,
            visual: 10,
            acting: 9,
            content: 'Visually spectacular but pacing was slightly dragged in the second half. Still, a masterpiece of modern sci-fi.',
            hasSpoiler: false,
        },
        {
            movieIndex: 0,
            userIndex: 3,
            story: 10,
            visual: 10,
            acting: 10,
            content: 'Absolutely perfect. The cinematography, the sound design, the acting—it deserves all the Oscars. Paul Atreides riding the sandworm is jaw-dropping!',
            hasSpoiler: true,
        },
        {
            movieIndex: 0,
            userIndex: 4,
            story: 8,
            visual: 9,
            acting: 8,
            content: 'Great continuation, though it deviates a bit from the book towards the end. Austin Butler is menacing as Feyd-Rautha!',
            hasSpoiler: false,
        },
        {
            movieIndex: 0,
            userIndex: 5,
            story: 7,
            visual: 10,
            acting: 9,
            content: 'Visuals and scale are unmatched, but the character development felt a bit rushed compared to the first film.',
            hasSpoiler: false,
        },
        {
            movieIndex: 1,
            userIndex: 1,
            story: 6,
            visual: 9,
            acting: 6,
            content: 'No real plot, but the monster battles are pure fun. Seeing Kong and Godzilla sprint together is worth the price of admission.',
            hasSpoiler: false,
        },
        {
            movieIndex: 1,
            userIndex: 2,
            story: 5,
            visual: 8,
            acting: 6,
            content: 'Visual effects are cool, but the human characters are extremely boring. Just fast forward to the fights.',
            hasSpoiler: false,
        },
        {
            movieIndex: 1,
            userIndex: 3,
            story: 6,
            visual: 9,
            acting: 7,
            content: 'Great pop-corn movie! Don\'t expect a deep storyline. It delivers exactly what it promises: giant monsters smashing buildings.',
            hasSpoiler: false,
        },
        {
            movieIndex: 1,
            userIndex: 4,
            story: 4,
            visual: 8,
            acting: 5,
            content: 'A bit too silly and cartoonish compared to the 2014 original. CGI is good but the story makes zero sense.',
            hasSpoiler: false,
        },
        {
            movieIndex: 1,
            userIndex: 5,
            story: 7,
            visual: 9,
            acting: 7,
            content: 'Loved the Hollow Earth designs and the fight sequences in Rio de Janeiro! Fun ride from start to finish.',
            hasSpoiler: false,
        },
        {
            movieIndex: 2,
            userIndex: 1,
            story: 9,
            visual: 9,
            acting: 9,
            content: 'Just as emotional and clever as the first one. Anxiety is the perfect new character and highly relatable for teenagers and adults alike.',
            hasSpoiler: false,
        },
        {
            movieIndex: 2,
            userIndex: 2,
            story: 8,
            visual: 9,
            acting: 8,
            content: 'Pixar does it again. Nostalgia was a great addition. Cried at the panic attack scene—very well handled.',
            hasSpoiler: false,
        },
        {
            movieIndex: 2,
            userIndex: 3,
            story: 9,
            visual: 8,
            acting: 9,
            content: 'A beautiful look at growing up and self-acceptance. The animation is colorful and rich. Highly recommended for families.',
            hasSpoiler: false,
        },
        {
            movieIndex: 2,
            userIndex: 4,
            story: 8,
            visual: 9,
            acting: 8,
            content: 'Relatable and funny. Some emotions felt a bit sidelined, but Joy and Anxiety carry the movie perfectly.',
            hasSpoiler: false,
        },
        {
            movieIndex: 2,
            userIndex: 5,
            story: 9,
            visual: 9,
            acting: 9,
            content: 'Anxiety taking over Riley\'s console is a powerful metaphor. A worthy sequel that will touch your heart.',
            hasSpoiler: false,
        },
        {
            movieIndex: 3,
            userIndex: 1,
            story: 8,
            visual: 8,
            acting: 9,
            content: 'Phuong Anh Dao gives a stellar performance. Tran Thanh\'s directing has improved significantly. A touching drama about societal pressure.',
            hasSpoiler: false,
        },
        {
            movieIndex: 3,
            userIndex: 2,
            story: 7,
            visual: 7,
            acting: 8,
            content: 'Good acting and chemistry. The ending is heartbreaking but very realistic for the situation they were in.',
            hasSpoiler: true,
        },
        {
            movieIndex: 3,
            userIndex: 3,
            story: 8,
            visual: 8,
            acting: 8,
            content: 'The film captures the struggles of independent women in modern Vietnam. Solid screenplay with some overly dramatic moments.',
            hasSpoiler: false,
        },
        {
            movieIndex: 3,
            userIndex: 4,
            story: 6,
            visual: 7,
            acting: 8,
            content: 'Tran Thanh\'s signature dialogues are present. A bit too long, but Phuong Anh Dao and Tuan Tran make it work.',
            hasSpoiler: false,
        },
        {
            movieIndex: 3,
            userIndex: 5,
            story: 8,
            visual: 8,
            acting: 9,
            content: 'Deeply emotional. It shows how past trauma can affect modern relationships. Best Vietnamese movie of the year so far.',
            hasSpoiler: false,
        },
        {
            movieIndex: 4,
            userIndex: 1,
            story: 8,
            visual: 8,
            acting: 9,
            content: 'The MCU is back! Ryan Reynolds and Hugh Jackman have the best bromance in cinema history. Nonstop laughs and brutal action.',
            hasSpoiler: false,
        },
        {
            movieIndex: 4,
            userIndex: 2,
            story: 7,
            visual: 8,
            acting: 9,
            content: 'So many cameos! It is a love letter to the Fox Marvel universe. Pacing is a bit messy but you won\'t care because it is so fun.',
            hasSpoiler: false,
        },
        {
            movieIndex: 4,
            userIndex: 3,
            story: 8,
            visual: 9,
            acting: 8,
            content: 'Jackman\'s yellow suit looks incredible. The fight in the Honda Odyssey is one of the funniest things I have ever seen.',
            hasSpoiler: false,
        },
        {
            movieIndex: 4,
            userIndex: 4,
            story: 7,
            visual: 7,
            acting: 9,
            content: 'Very meta, jokes are hilarious. The emotional stakes are a bit low, but seeing Logan and Deadpool slice and dice is amazing.',
            hasSpoiler: false,
        },
        {
            movieIndex: 4,
            userIndex: 5,
            story: 9,
            visual: 8,
            acting: 10,
            content: 'Loved every single second of it. Cassandra Nova is a creepy and great villain, and the final sequence is satisfying.',
            hasSpoiler: true,
        },
    ];
    for (const rc of reviewContents) {
        const movie = movies[rc.movieIndex];
        const user = users[rc.userIndex];
        const avg = Number(((rc.story + rc.visual + rc.acting) / 3).toFixed(2));
        await ReviewModel.create({
            userId: user._id,
            movieId: movie._id,
            storyScore: rc.story,
            visual: rc.visual,
            visualScore: rc.visual,
            actingScore: rc.acting,
            averageScore: avg,
            content: rc.content,
            hasSpoiler: rc.hasSpoiler,
            isReported: false,
            reportCount: 0,
        });
    }
    console.log('Seeding reported spam reviews...');
    const spamReview = await ReviewModel.create({
        userId: users[2]._id,
        movieId: movies[0]._id,
        storyScore: 1,
        visualScore: 1,
        actingScore: 1,
        averageScore: 1,
        content: 'SPAM SPAM FREE BITCOIN VISIT HTTPS://SPAM.COM TO WIN FREE MOVIE TICKETS!!!!',
        hasSpoiler: false,
        isReported: true,
        reportCount: 6,
    });
    console.log('Seeding done successfully!');
    await mongoose.disconnect();
    console.log('Disconnected from database.');
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=dynamic-seeder.js.map