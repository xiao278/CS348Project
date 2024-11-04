interface Credentials {
    username: string;
    password: string;
};

interface BrowseTables {
    languages: {
        lang_id: number;
        language: string;
    }[];
    genres: {
        genre_id: number;
        genre: string;
    }[];
};

export { Credentials, BrowseTables };