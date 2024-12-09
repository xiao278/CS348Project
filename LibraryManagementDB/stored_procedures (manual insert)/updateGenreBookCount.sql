-- count number of books each genre has
DELIMITER //
-- drop procedure if exists hides the subsequent syntax errors for some reason
DROP PROCEDURE IF EXISTS updateGenreBookCount;
CREATE PROCEDURE updateGenreBookCount()
BEGIN
	DROP TEMPORARY TABLE IF EXISTS new_book_counts;
	CREATE TEMPORARY TABLE new_book_counts AS
	SELECT bg.genre_id, COUNT(bg.book_id) AS book_count
    FROM Book_Genre bg
    GROUP BY bg.genre_id;
    
    UPDATE Genres g
    JOIN new_book_counts nc ON g.genre_id = nc.genre_id
    SET g.book_count = nc.book_count;

    DROP TEMPORARY TABLE new_book_counts;
END //

DELIMITER ;