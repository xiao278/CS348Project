import { Logins, Staff_Login, Reader_Login } from "./tables";

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

export { verify_login }