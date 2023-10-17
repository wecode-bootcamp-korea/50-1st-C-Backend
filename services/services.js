const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/models/appdata/datasrc.js")

// 중복 가입하는 사람은 별로 없지 않을까?
class UserInfoService {
    constructor(nickname, email) {
        this._nickname = nickname;
        this._email = email
    }
    findUserWithInfo = async () => {
        const isExistingInfo = await appDataSource.query(`
        SELECT id 
        FROM users 
        WHERE 
        email = '${this._email}' OR nickname = '${this._nickname}'
        `)
        console.log("UserInfoService.findUserWithInfo.isExistingInfo >> ExistingInfo: ", isExistingInfo);
        if (isExistingInfo.length) {
            throw new Error.statusCode(409).json({"message": "Oops! Your Email or Nickname Already Exists in Our Members Group"})
        }
        console.log(`UserInfoService.findUserWithInfo(_nickname, _email) >> No Problem, nickname: '${this._nickname}'\'s signUp seems to be ongoing well`)
        console.log("Email and Nickname are not duplicated with Our Members")
    }
}


class EmailService {
    constructor(email) {
        this._email = email;
    }
    findUserWithEmail = async () => {   // DB에 email이 존재하는 지 확인만 한다. signUp.js, logIn.js에서 call한다. 로그인할 때 이메일을 치게 하면 써먹겠다 => findEmail => login.js//닉네임을 이메일로 찾을 때, 비밀번호 변경 요청을 위한 정보 중에 하나를 이메일로 할 때
        const existingEmailToId = await appDataSource.query(`
            SELECT id 
            FROM users 
            WHERE 
            email = '${this._email}'
            `)
        try{

        } catch (e) {
            console.error(e)
        } finally {
            console.log('The ID using the Email(this._email) \'s Number is: ' + existingEmailToId )
        }

    }

    validateEmailIsEmail() {   // 이메일을 예쁘게 씁시다. 이메일 양식 확인 sync func.
        if (this._email.includes(".") === false || this._email.includes("@") === false) {
            throw new Error.statusCode(409).json({"message": "Invalid Email Form"})
        }
        console.log(`Email this._email: '${this._email}' is Available`)
    }}

class NicknameService {
    constructor(nickname) {
        this._nickname = nickname;
    }

    findUserWithNickname = async () => {
        const existingNicknameToId = await appDataSource.query(
            `SELECT id 
            FROM users 
            WHERE 
            users.nickname = '${this._nickname}'
    `)
        // return existingNicknameToId
}}

// module.exports = { }
module.exports = { EmailService}
module.exports = { NicknameService }
module.exports = { UserInfoService }
