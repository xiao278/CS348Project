interface User {
    name: string;
    age: number;
    email?: string; // Optional property
}

interface LoginPayload {
    username: string;
    password: string;
}

interface BookQuery {
    title: string; //LIKE "%title%"
    publisher: string; //LIKE "%pub%"
    language_id: number; //LIKE "lang" (direct match)
    author: string; //LIKE "%author%" 
    include_genre_ids: number[]; 
    exclude_genre_ids: number[]; 
}

interface BookInfoRequest {
    book_id: number;
    auth?: LoginPayload;
}

interface BorrowRequest {
    book_id: number;
    auth: LoginPayload;
}

interface AlterCopyRequest {
    book_id: number;
    copy_id?: number;
    auth: LoginPayload;
}

export {LoginPayload, BookQuery, BookInfoRequest, BorrowRequest, AlterCopyRequest};


