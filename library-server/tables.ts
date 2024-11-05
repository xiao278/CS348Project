import { Sequelize, Model, DataTypes } from "sequelize";

// setup connection to mysql
const sequelize = new Sequelize(
    'LibraryManagementDB',
    'lib_backend',
    '12345678@',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

class Logins extends Model {}
Logins.init(
    {
        // Model attributes are defined here
        username: {
            type: DataTypes.CHAR(32),
            primaryKey: true
        },
        password: {
            type: DataTypes.CHAR(32),
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Logins', // We need to choose the model name
    },
);


class Readers extends Model {}
Readers.init(
    {
        reader_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        phone_num: {
            type: DataTypes.STRING(15),
        },
        address: {
            type: DataTypes.STRING(100),
        },
        email: {
            type: DataTypes.STRING(254),
        },
        name: {
            type: DataTypes.STRING(50),
        }
    },
    {
        sequelize,
        modelName: 'Readers'
    }
)


class Staffs extends Model {}
Staffs.init(
    {
        staff_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
        }
    },
    {
        sequelize,
        modelName: 'Staffs'
    }
)


class Staff_Login extends Model {}
Staff_Login.init(
    {
        staff_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Staffs,
                key: 'staff_id'
            }
        },
        username: {
            type: DataTypes.STRING(32),
            references: {
                model: Logins,
                key: 'username'
            }
        }
    },
    {
        sequelize,
        modelName: 'Staff_Login',
        tableName: 'Staff_Login'
    }
)



class Reader_Login extends Model {}
Reader_Login.init(
    {
        reader_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Readers,
                key: 'reader_id'
            }
        },
        username: {
            type: DataTypes.STRING(32),
            references: {
                model: Logins,
                key: 'username'
            }
        }
    },
    {
        sequelize,
        modelName: 'Reader_Login',
        tableName: 'Reader_Login'
    }
)


class Languages extends Model{}
Languages.init(
    {
        lang_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        language: {
            type: DataTypes.STRING(50)
        }
    },
    {
        sequelize,
        modelName: "Languages"
    }
);

class Publishers extends Model {}
Publishers.init(
    {
        publisher_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(125)
        }
    },
    {
        sequelize,
        modelName: "Publishers"
    }
)

class Books extends Model {}
Books.init(
    {
        book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(256),
        },
        lang_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Languages,
                key: "lang_id"
            },
            allowNull: true
        },
        publisher_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Publishers,
                key: "publisher_id"
            },
            allowNull: true
        },
        publish_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Books'
    }
);


class Authors extends Model{}
Authors.init(
    {
        author_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(75),
        }
    },
    {
        sequelize,
        modelName: "Authors"
    }
);


class Genres extends Model{}
Genres.init(
    {
        genre_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        genre: {
            type: DataTypes.STRING(30)
        }
    },
    {
        sequelize,
        modelName: "Genres"
    }
);


class Written_By extends Model{}
Written_By.init(
    {
        author_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Authors,
                key: "author_id"
            }
        },
        book_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Books,
                key: "book_id"
            }
        },
        role: {
            type: DataTypes.STRING(30)
        }
    },
    {
        sequelize,
        modelName: "Written_By",
        tableName: "Written_By"
    }
);


class Book_Genre extends Model{}
Book_Genre.init(
    {
        book_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Books,
                key: "book_id"
            }
        },
        genre_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Genres,
                key: "genre_id"
            }
        }
    },
    {
        sequelize,
        modelName: "Book_Genre",
        tableName: "Book_Genre"
    }
);

Books.belongsToMany(Authors, {through: Written_By, foreignKey: "book_id"});
Authors.belongsToMany(Books, {through: Written_By, foreignKey: "author_id"});

Books.belongsToMany(Genres, {through: Book_Genre, foreignKey: "book_id"});
Genres.belongsToMany(Books, {through: Book_Genre, foreignKey: "genre_id"});

Languages.hasMany(Books, {foreignKey: "lang_id"});
Books.belongsTo(Languages, {foreignKey: "lang_id"});

Publishers.hasMany(Books, {foreignKey: "publisher_id"});
Books.belongsTo(Publishers, {foreignKey: "publisher_id"})

export {sequelize, 
    Logins, Readers, Staffs, Reader_Login, Staff_Login,
    Books, Languages, Publishers,
    Genres, Book_Genre,
    Authors, Written_By
}