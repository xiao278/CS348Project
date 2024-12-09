import { verify_login } from "./auth";
import { sequelize } from "./tables";
import { QueryTypes } from "sequelize";

async function getGenreCounts(top_genres: number) {
    const genreCounts = await sequelize.query(`
        SELECT g.genre, g.book_count
        FROM Genres g
        ORDER BY g.book_count DESC
        LIMIT ${top_genres}`,
        {type: QueryTypes.SELECT}
    );
    return genreCounts
}

async function getCopiesStatusCounts() {
    const statusCounts = await sequelize.query(`
        SELECT * 
        FROM Copies_Status_Count`,
        {type: QueryTypes.SELECT}
    );
    return statusCounts;
}

async function getGenreSimilarity() {
    const genreSimilarity = await sequelize.query(`
        SELECT gs.genre_id1, g1.genre AS genre1, gs.genre_id2, g2.genre as genre2, gs.shared_books
        FROM Genre_Similarity gs JOIN Genres g1 ON gs.genre_id1 = g1.genre_id
        JOIN Genres g2 ON gs.genre_id2 = g2.genre_id`,
        {type: QueryTypes.SELECT}
    );
    return genreSimilarity;
}

async function getAllStats() {
    const stats = {
        genre_books: await getGenreCounts(20),
        copy_status: await getCopiesStatusCounts(),
        genre_similarity: await getGenreSimilarity()
    }
    return stats;
}

export {
    getAllStats
}