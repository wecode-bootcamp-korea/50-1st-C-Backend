const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()
// require("express-async-errors")
// const { body, validationResult } = require("express-validator")

const appDataSource = new DataSource(
    {
        type: "mysql",
        host: '127.0.0.1',
        port: '3306',
        username: "root",
        password: "1234",
        database: "WETHREAD"
    }
)
const signUp = async( req, res ) => {

    appDataSource.initialize().then(
        () => {
            console.log("Initialized! Your DB is initialized via typeorm DataSource")
        }
    )

    // variables in signUp() Announcement and values Appending
    const userNickName = req.body.nickname
    const userEmail = req.body.email
    const userPassword = req.body.password


    // 중복 가입하는 사람은 별로 없지 않을까?
    const duplicatedEmailInfo = await appDataSource.query(
        `
           SELECT id FROM users 
           WHERE email = '${userEmail}'
           `
    )
    // 중복 이메일이 있는 id를 Db에 요청하여 Null이 아닌 값을 받아 왔을 경우
    const checkEmailDuplication = () => {
        if (!duplicatedEmailInfo.length) {
            // throw new Error ("INVALID EMAIL. THE EMAIL IS ALREADY USED");
            return res.status(409).json({"message": "THE EMAIL IS ALREADY USED"})
        }
    }

    checkEmailDuplication()

    // express-async-errors 가 없으면 next로 error를 call해야 한다.



    // 닉네임을 포기하시오. 이메일은 달랐을 수도 있어도 닉네임을 먹을 수 없어요
    // 닉네임 중복 검사
    const duplicatedNicknameInfo = await appDataSource(
        `
           SELECT id FROM users 
           WHERE nickname = '${userNickName}'
           `
    )

    checkNicknameDuplication = () => {
        if (duplicatedNicknameInfo.length) {
            // throw new Error ("INVALID NICKNAME")
            return res.status(409).json({"message": "INVALID NICKNAME"});
        }
    }
    checkNicknameDuplication()


    // 이메일 형식 검사 (Db query)
    const checkEmailIsValidate = () => {
        if (userEmail.includes(".") === false || userEmail.includes("@") === false) {
            res.status(400).json({"message": "INVALID EMAIL FORM"})
        }
    }

    checkEmailIsValidate()

    // Password 길이 부족 핸들링 (email 입력 오류보다 더 적은 케이스)
    // 의외로 닉네임 중복 등이 길이 조건 예외보다 더 적지 않을까? 해서 내렸다.
    const checkPasswordLength = () => {
        if (userPassword.length < 10) {
            res.status(400).json({"message": "PASSWORD SHOULD BE SAME OR LONGER THAN 10"})
        }
    }

    checkPasswordLength()

    // // Password Impact Check 숫자/영대문/영소문/특문 모두 포함 및 8자 이상
    // // //
    // const checkPassword = () => {
    //
    //     let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    //
    //     let pw = userPassword.val();
    //
    //     if(reg.test(pw) === false) {
    //         alert('비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.');
    //     }
    //     else {
    //         console.log("통과");
    //     }
    // }
    // checkPassword()


    // signUp 단계에서 signUp input에 입력하여 valid 검증을 하면
    // 사용 가능한 nickname이면 200 method res를 받는 게 낫다.
    // email도 마찬가지
    // 두 조건을 동시에 전부 돌리는 것보다 두 조건 따로 돌리는 게 낫다.
    // ajax 구현도 방법 중 하나(email, nickname 중복 검증 버튼 생성)



    // 3 params Saviour
    const userData = await appDataSource.query(`
      INSERT INTO users (
      nickname,
      email,
      password
        )
    VALUES (
      '${userNickName}',
      '${userEmail}',
      '${userPassword}'
        )`)

    // just Logging. If ./.env.LOGGING === FALSE, NO LOGGING WILL APPEAR ON CONSOLE (그냥 한국어로 적을까)
    console.log("TYPEORM DATA RETURNS: ", userData)

    // frontend server로 message json 전송
    return res.status(201).json({"message": "userCREATED"})
}

module.exports = { signUp }