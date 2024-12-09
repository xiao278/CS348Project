DELIMITER //
DROP PROCEDURE IF EXISTS calcGenreSimilarity;
CREATE PROCEDURE calcGenreSimilarity (IN num_genres INT)
BEGIN
	DROP TABLE IF EXISTS top_genres;
	CREATE TABLE top_genres AS
	SELECT bg.book_id, bg.genre_id
	FROM Book_Genre bg 
    JOIN ( 
		SELECT genre_id
		FROM Genres g
        WHERE g.book_count IS NOT NULL
		ORDER BY g.book_count DESC
		LIMIT num_genres
    ) t ON bg.genre_id = t.genre_id;
    
	DROP TABLE IF EXISTS unique_genres;
    CREATE TABLE unique_genres AS
	SELECT DISTINCT t.genre_id
    FROM top_genres t;
    
	DROP TEMPORARY TABLE IF EXISTS genre_pairs;
    CREATE TEMPORARY TABLE genre_pairs AS
	SELECT t1.genre_id AS genre_id1, t2.genre_id AS genre_id2
	FROM unique_genres t1 JOIN unique_genres t2 ON t1.genre_id < t2.genre_id;
    
    DROP TABLE IF EXISTS Genre_Similarity;
    CREATE TABLE Genre_Similarity AS
	SELECT gp.genre_id1, gp.genre_id2, (
        SELECT COUNT(*)
        FROM (
            (
                SELECT tg.book_id
                FROM top_genres tg
                WHERE tg.genre_id = gp.genre_id1
            ) t1 JOIN (
                SELECT tg.book_id
                FROM top_genres tg
                WHERE tg.genre_id = gp.genre_id2
            ) t2 ON t1.book_id = t2.book_id
        )
    ) AS shared_books
    FROM genre_pairs gp;

    DROP TABLE top_genres;
    DROP TABLE unique_genres;
    DROP TEMPORARY TABLE genre_pairs;
END //
DELIMITER ;