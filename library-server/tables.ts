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
            type: DataTypes.CHAR(15),
        },
        address: {
            type: DataTypes.CHAR(100),
        },
        email: {
            type: DataTypes.CHAR(254),
        },
        name: {
            type: DataTypes.CHAR(50),
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
            type: DataTypes.CHAR(50),
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
            type: DataTypes.CHAR(32),
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
            type: DataTypes.CHAR(32),
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

export {sequelize, Logins, Readers, Staffs, Reader_Login, Staff_Login}