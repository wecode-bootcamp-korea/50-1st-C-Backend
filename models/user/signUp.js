const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/models/appdata/datasrc.js")
const { UserInfoServices } = require("../../services/services")
const { EmailServices } = require("../../services/services")
const signUp = async( req, res ) => {

    // variables in signUp() Announcement and values Appending
    const userNickName = req.body.nickname
    const userEmail = req.body.email
    const userPassword = req.body.password;

    // 혹시 모르니까 이메일 먼저 체크 그 담에 닉네임 체크. 아래는 비동기 함수로 안에 await 문으로 db를 먼저 읽는다.
    // 에러가 없다면 문제가 없는 것입니다. 에러 말고 콘솔에 뭐라고 함수 이름이랑 정보 뜰 것.
    await UserInfoServices.findUserWithInfo(); // 이메일 먼저 중복 검사 한 후에 닉네임 중복 검사. 이메일 형식 오류보다 덜 일어날 것 같다. cmd+click하면 findUserWithInfo()로 넘어간다.



    // 이메일 형식 검사 // 이건 ajax로 빼야된다. 가입 버튼 누르기 전에!!


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
      INSERT INTO USERS (
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

    try{
        console.log("TYPEORM DATA RETURNS: ", userData)
    } catch (e) {
        console.error(e) // err 대신 e로 통일하기로 하자.
    } finally {
        console.log("SUCCESS >> You got signed up Well")
    }
    // frontend server로 message json 전송
    return res.status(201).json({"message": "userCREATED"})
}

module.exports = { signUp }