-- relations
DROP TABLE IF EXISTS Book_Genre;
DROP TABLE IF EXISTS Book_Lang;
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS Reader_Login;
DROP TABLE IF EXISTS Staff_Login;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS Borrow;
DROP TABLE IF EXISTS Published_By;
DROP TABLE IF EXISTS Written_By;

-- weak entities
DROP TABLE IF EXISTS Copies;

-- strong entities
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Languages;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Publishers;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Readers;
DROP TABLE IF EXISTS Logins;
DROP TABLE IF EXISTS Staffs;

CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title NVARCHAR(256)
);

CREATE TABLE Languages (
    lang_id INT AUTO_INCREMENT PRIMARY KEY,
    language VARCHAR(35)
);

CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre VARCHAR(30)
);

CREATE TABLE Publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Readers (
    reader_id INT AUTO_INCREMENT PRIMARY KEY,
    phone_num VARCHAR(15),
    address VARCHAR(150),
    email VARCHAR(254),
    name VARCHAR(50)
);

CREATE TABLE Logins (
    username VARCHAR(32) PRIMARY KEY,
    password VARCHAR(32)
);

CREATE TABLE Staffs (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Copies (
    copy_id INT,
    location VARCHAR(30),
    `status` CHAR(9), -- available, lost, borrowed
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE,
    PRIMARY KEY (copy_id, book_id)
); 

CREATE TABLE Published_By (
    `date` DATE,
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    publisher_id INT,
    FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id),
    PRIMARY KEY (publisher_id, book_id)
);

CREATE TABLE Written_By (
    role VARCHAR(30),
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
    -- PRIMARY KEY (author_id, book_id, role)
);

CREATE TABLE Borrow (
    due_date DATE,
    borrow_date DATE,
    copy_id INT,
    book_id INT,
    FOREIGN KEY (copy_id, book_id) REFERENCES Copies(copy_id, book_id),
    PRIMARY KEY (copy_id, book_id)
);

CREATE TABLE Report (
    report_date DATE,
    issue VARCHAR(100),
    fine FLOAT,
    resolved TINYINT, -- 0 if unresolved, 1 if resolved
    copy_id INT,
    book_id INT,
    FOREIGN KEY (copy_id, book_id) REFERENCES Copies(copy_id, book_id),
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id),
    reader_id INT,
    FOREIGN KEY (reader_id) REFERENCES Readers(reader_id),
    PRIMARY KEY (copy_id, book_id, staff_id, reader_id)
);

CREATE TABLE Staff_Login (
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES Staffs(staff_id),
    username VARCHAR(32),
    FOREIGN KEY (username) REFERENCES Logins(username)
);

CREATE TABLE Reader_Login (
    reader_id INT,
    FOREIGN KEY (reader_id) REFERENCES Readers(reader_id),
    username VARCHAR(32),
    FOREIGN KEY (username) REFERENCES Logins(username)
);

CREATE TABLE Wishlist (
	reader_id INT,
    FOREIGN KEY (reader_id) REFERENCES Readers(reader_id),
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    PRIMARY KEY (reader_id, book_id)
);

CREATE TABLE Book_Lang (
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    lang_id INT,
    FOREIGN KEY (lang_id) REFERENCES Languages(lang_id)
);

CREATE TABLE Book_Genre (
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    genre_id INT,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);