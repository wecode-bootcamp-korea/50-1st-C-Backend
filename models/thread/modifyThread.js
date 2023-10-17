const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/models/appdata/datasrc.js")

const modifyThread = async (req, res) => {

    // 원래 req.session req.sessionId를 call 해야 한다.
    const threadId = req.body.threadId;
    const userId = req.body.userId;
    const modifiedContent = req.body.content

    // 위의 userId는 sessionId만 받아와도 상관없다.
    // 수정 버튼을 눌러서 content를 수정해서 입력할 때 sessionID와 thread의 user_id의 일치 여부를 확인하고
    // 수정 완료 버튼을 눌러서 patch 요청을 받을 때, sessionId와 thread.user_id의 일치 여부를 다시 확인한다.
    // content 수정 후 제출까지의 시간동안 로그아웃됏을 수도 있기 때문

    // content 수정 화면에서 나가면 Patch 요청이 안됐기 때문에 수정이 반영되지 않는다.
    // 임시 저장 기능을 만들어 주자.
    // 임시 저장 글 table을 따로 만들어야 한다. primary key를 통해 id를 자동생성하고, 임시 저장 후 게시하면 기존의 임시 저장 글 table에서 DROP한다.
    // 임시 저장 글 목록 url => 목록의 글 클릭 => redirect 후에 get 요청으로 임시 저장된 글 content와 title 등 get하여
    // 게시글 작성 url에서 수정 후 게시 버튼으로 post() => createThread 요청
    // 또는 임시 저장 버튼을 눌러 임시 저장 글 table에 patch() 실행

    // content 내용에 대한 수정을 입력하면 창 닫기/redirect 요청 시에 alert로 저장되지 않았다는 알림문이 뜨도록 frontend js에서 설정
    // (browser의 변경되지 않은 사항 알림 기능과도 연동)

    // ex1. 친구가 몰래 게시물을 수정하려는 것을 발견하여 바로 브라우저로 홈페이지로 가서 로그아웃 시켰다.
    // 친구가 몰래 다른 tab 묶음에 게시물 수정 창을 열어 놓아 그대로 수정 완료에 성공하였다.

    // THREAD
    const validThread = await appDataSource.query(
        `
        SELECT id, content, user_id FROM threads 
        WHERE id = '${threadId}'
        `
    )
    if (!validThread) {
        res.status(404).json({"message": "THREAD NOT FOUND"})
    }
    // ID
    const validId = await appDataSource.query(
        `
        SELECT id FROM threads 
        WHERE user_id = '${userId}'
        `
    )
    if (!validId) {
        res.status(401).json({"message": "REQUEST UNAUTHORIZED, LOGIN REQUIRED"})
    }




    const updatedContent = await appDataSource.query(
        `
        UPDATE threads 
        SET content = '${modifiedContent}' 
        WHERE threads.id = '${threadId}'
        ;
        `
    )
    console.log("TYPEORM DATA RETURNS LENGTH: ", updatedContent.length)

    return res.status(201).json({"message": "Successfully Like!", "updatedDate": content})


}

module.exports = { modifyThread }