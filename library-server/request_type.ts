interface User {
    name: string;
    age: number;
    email?: string; // Optional property
}

interface LoginPayload {
    username: string;
    password: string;
}

interface BookGenre {
    id: number; //LIKE "%"
    include: boolean;
}

interface BookQuery {
    title: string; //LIKE "%title%"
    publisher: string; //LIKE "%pub%"
    language_id: number; //LIKE "lang" (direct match)
    author: string; //LIKE "%author%" 
    genres: BookGenre[]; 
}

export {LoginPayload, BookQuery};


