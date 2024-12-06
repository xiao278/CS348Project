INSERT INTO Copies (book_id, copy_id, `status`)
SELECT book_id, 1, "available" FROM Books