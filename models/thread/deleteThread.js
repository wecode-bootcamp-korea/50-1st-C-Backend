// const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/appdata/datasrc.js")
//
//
// const deleteThread = async (req, res) => {
//
//     appDataSource.initialize().then(
//         () => {
//             console.log("Data Source has been initialized!");
//         })
//
//     // session id 할당 및 call은 유저가 작성한 게시물만 삭제 가능할 때 구현하자
//     // 작성자를 확인할 필요가 없으면 thread.user_id column은 요청할 때 탐색할 필요가 없다
//
//     // 전체 게시판(thread 앱에서는 newsfeed)에서 특정 thread를 삭제하려면 전체 thread 목록을 get한
//     // 화면에서 특정 Json으로 받아온 게시물 id 하나를 select해, user Session과 함께 Server로 전송하면
//     // Session의 user primary key id와 thread.id(pk)가 일치하면 delete해 주는 기능으로 구현
//     // delete 조건이 req.body의 title 또는 includes.keyword이라면 LIKE, BINARY를 활용하자.(필요 시에)
//
//     // req의 session 사용법은 잘 모르겠다. 공부해 보자
//
//     // Only one param used
//     // ""
//     // const sessionId = req.sessionId
//     // const userId = req.body.user_id;
//     // """
//     const threadId = req.body.id;
//
//     const deleteTargetThread = await appDataSource.query(`
//         DELETE FROM threads WHERE threads.id = '${threadId}'
//         `);
//
//     console.log("TYPEORM DATA RETURNS LENGTH: ", deleteTargetThread.length)
//
//     // try {
//     //     length.deletedThread > 0;
//     // }
//     // catch (err) {
//     //     console.error(err)
//     // }
//
//     return res.status(204).json({"message": "Succesfully Deleted the Thread!"})
//
// }
//
// module.exports = { deleteThread }


