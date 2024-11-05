import { col, fn, Includeable, Op, Options, WhereOptions } from "sequelize";
import { Books, Book_Genre, Written_By, Authors, Genres, Languages, Publishers } from "./tables";
import { BookQuery } from "./request_type";

const page_items = 15;
const max_pages = 100;

interface QueryStats {
    num_books: number;
    num_pages: number;
}

function build_query_base(filters:BookQuery, isCounting:boolean) {
    let title_match:WhereOptions = {};
    if (filters.title.length > 0) {
        title_match = {
            title: {
                [Op.like]: `%${filters.title}%`
            }
        };
    };

    let does_match_author:boolean = filters.author.length > 0;
    let author_match:WhereOptions = {};
    if (does_match_author) {
        author_match = {
            "name": {
                [Op.like]: `%${filters.author}%`
            }
        };
    };

    let does_match_lang:boolean = filters.language_id > 0;
    let lang_match:WhereOptions = {};
    if (does_match_lang) {
        lang_match = {
            "lang_id": filters.language_id
        };
    };

    let does_match_pub:boolean = filters.publisher.length > 0;
    let pub_match:WhereOptions = {};
    if (does_match_pub) {
        pub_match = {
            "name": {
                [Op.like]: `%${filters.publisher}%`
            }
        };
    }

    let does_match_genre:boolean = filters.genres.length > 0
    // let genre_match:WhereOptions = {}
    // if (does_match_genre) {
    //     let include_list:number[] = []
    //     let exclude_list:number[] = []
    //     filters.genres.forEach((item) => {
    //         if (item.include) {
    //             include_list.push(item.id)
    //         }
    //         else {
    //             exclude_list.push(item.id)
    //         }
    //     });
    //     genre_match = {
            
    //     }
    // }

    let partial_query = {
        include: [
            {
                model: Authors,
                required: does_match_author,
                attributes: isCounting ? [] : ['name'],
                through: {
                    attributes:[]
                },
                where: author_match
            },
            {
                model: Languages,
                required: does_match_lang,
                attributes: isCounting ? [] : ['language'],
                where: lang_match,
            },
            {
                model: Publishers,
                required: does_match_pub,
                attributes: isCounting ? [] : ['name'],
                where: pub_match
            },
            {
                model: Genres,
                required: does_match_genre,
                attributes: isCounting ? [] : ['genre'],
                through: {
                    attributes:[]
                },
                where: {}
            }
        ],
        where: title_match,
        attributes: isCounting ? [] : ['book_id', 'title'],
    }
    return partial_query
}

//TODO include role
async function find_matching_books(filters: BookQuery, page: number) {
    let partial_query = build_query_base(filters, false)

    let full_query = Object.assign({}, partial_query, {
        logging: false,
        limit: page_items,
        offset: (page - 1) * page_items
    });
    
    let matching_books = await Books.findAll(full_query).then((query) => query.map((tuple) => tuple.toJSON()));

    return matching_books;
}

async function count_matching_books(filters) {
    let partial_query = build_query_base(filters, true)
    let full_query = Object.assign({}, partial_query, {
        logging: false,
        distinct: true,
        col: 'book_id',
        limit: max_pages * page_items
    });

    let book_count = await Books.count(full_query);
    let pages_count = Math.ceil(book_count / page_items)
    let result_obj:QueryStats = { num_books: book_count, num_pages: pages_count }
    return result_obj;
}

async function send_tables() {
    let langs = await Languages.findAll({
        attributes: ['lang_id', 'language']
    }).then((query) => query.map((tuple) => tuple.toJSON()));
    let genres = await Genres.findAll({
        attributes: ['genre_id', 'genre']
    }).then((query) => query.map((tuple) => tuple.toJSON()));
    return {languages: langs, genres: genres}
}

export{ find_matching_books, send_tables, count_matching_books }