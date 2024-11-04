interface Credentials {
    username: string;
    password: string;
}

interface LanguageItem {
    lang_id: number;
    language: string;
}

interface GenreItem {
    genre_id: number;
    genre: string;
}

interface BrowseTables {
    languages: LanguageItem[];
    genres: GenreItem[];
}

export { Credentials, BrowseTables }