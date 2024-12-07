-- count number of books each genre has
DELIMITER //
-- drop procedure if exists hides the subsequent syntax errors for some reason
-- DROP PROCEDURE IF EXISTS countCopyStatus;
CREATE PROCEDURE countCopyStatus()
BEGIN
	DROP TABLE IF EXISTS Copy_Status_Count;
	CREATE TABLE Copy_Status_Count AS
    SELECT c.status, COUNT(*) AS status_count
    FROM Copies c
	GROUP BY c.status;
END //

DELIMITER ;