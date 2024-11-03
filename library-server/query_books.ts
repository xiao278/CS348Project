import { Includeable, Op, Options, WhereOptions } from "sequelize";
import {Books, Book_Lang, Book_Genre, Written_By, Authors, Genres, Languages} from "./tables";
import { BookQuery } from "./request_type";

/*
async function verify_login(usr:string, pwd:string) {
    let result = await Logins.findAll({
        attributes: ['username'],
        where: {
            username: usr,
            password: pwd
        }
    });
    if (result.length > 0) {
        let username:string = result[0].dataValues.username;
        let result_staff = await Staff_Login.findAll({
            attributes: ['staff_id'],
            where: {
                username: username
            }
        });
        if (result_staff.length > 0) {
            return "staff";
        };
        let result_reader = await Reader_Login.findAll({
            attributes: ['reader_id'],
            where: {
                username: username
            }
        });
        if (result_reader.length > 0) {
            return "reader";
        }
        else {
            return "user has no role";
        }
    }
    else return null;
}
*/


//TODO include role
async function find_matching_books(filters: BookQuery, page: number) {
    const page_items = 15;

    let title_match:WhereOptions = {}
    if (filters.title.length > 0) {
        title_match = {
            title: {
                [Op.like]: `%${filters.title}%`
            }
        }
    }

    let does_match_author:boolean = filters.author.length > 0
    let author_match:WhereOptions = {}
    if (does_match_author) {
        author_match = {
            "name": {
                [Op.like]: `%${filters.author}%`
            }
        }
    }

    let does_match_lang:boolean = filters.language_id > 0
    let lang_match:WhereOptions = {}
    if (does_match_lang) {
        lang_match = {
            "lang_id": filters.language_id
        }
    }
    
    let matching_books = await Books.findAll({
        include: [
            {
                model: Authors,
                required: does_match_author,
                attributes: ['name'],
                through: {
                    attributes:[]
                },
                where: author_match
            },
            {
                model: Languages,
                required: does_match_lang,
                attributes: ['language'],
                through: {
                    attributes:[]
                },
                where: lang_match
            }
        ],
        where: title_match,
        attributes: ['book_id', 'title'],
        logging: true
    }).then((query) => query.map((tuple) => tuple.toJSON()));

    return matching_books;
}

export{ find_matching_books }