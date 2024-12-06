CREATE UNIQUE INDEX book_idx ON Books(book_id);
CREATE INDEX book_borrow_idx ON Copies(book_id, borrower);
CREATE INDEX book_genre_idx ON Book_Genre(book_id);