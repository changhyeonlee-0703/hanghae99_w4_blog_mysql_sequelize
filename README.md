# hanhe99_w4_blog_mysql_sequelize

# **DB Table ERD**

![Untitled](hanhe99_w4_blog_mysql_sequelize%2093144ca307094af2807021b3ea1b81d9/Untitled.png)

# 블로그 기능 API 명세

| 기능 | API URL | Method | request | response | 비고 |
| --- | --- | --- | --- | --- | --- |
| 회원가입 | /users | POST | {
"email":"test1@email.com",
"nickname":"test1",
"password":"1234",
"confirmPassword":"1234"
} |  |  |
| 로그인 | /auth | POST | {
"email":"test1@email.com",
"password":"1234"
} |  |  |
| 유저 인증 | /users/me | GET | Headers Auth : Bearer{token} | {
”email”:”test1@email.com”,
”nickname”:”test1”
} |  |
| 게시글 생성 | /posts | POST | Headers Auth : Bearer{token}
{
"title":"글제목1",
"content":"글의 내용1"
} | { 
message: "게시글을 생성하였습니다." 
} |  |
| 전체 게시글 조회 | /posts | GET |  | { "data": [ 
  { 
    "postId": 2, 
    "userId": 1, 
    "nickname": "Developer", 
    "title": “글제목1",     
    "createdAt": "2022-07-25T07:45:56.000Z", 
    "updatedAt": "Date 날짜", 
    "likes": 0 
  }, 
  { 
    "postId": 1, 
    "userId": 1, 
    "nickname": "Developer", 
    "title": "글제목2", 
    "createdAt": "Date 날짜", 
    "updatedAt": “Date 날짜", 
    "likes": 1 
  } 
]} |  |
| 게시글 상세 조회 | /posts/:_postId | GET |  | { "data": [
  {
    "postId": 2,
    "userId": 1,
    "nickname": "Developer",
    "title": “글제목1",
    “content”:”글의내용1”,
    "createdAt": "2022-07-25T07:45:56.000Z",
    "updatedAt": "Date 날짜",
    "likes": 0
  }
]} |  |
| 게시글 수정 | /posts/:_postId | PUT | Headers Auth : Bearer{token}
{
"password":"1234",
"title":"수정된 글제목2",
"content":"수정된 글의 내용2"
} | {
success: true, 
Message: "수정이 완료되었습니다.”
} |  |
| 게시글 삭제 | /posts/:_postId | DELETE | Headers Auth : Bearer{token}
{
"password":"1234",
"title":"수정된 글제목2",
"content":"수정된 글의 내용2"
} | { 
message: "게시글을 삭제하였습니다." 
} |  |
| 좋아요 삽입/삭제 | /posts/:_postId/like | PUT | Headers Auth : Bearer{token} | Data 있을 시 :
{ message: "게시글의 좋아요를 취소하였습니다." }

Data 없을 시 : 
{ message: "게시글의 좋아요를 등록하였습니다." } |  |
| 좋아요 게시글 조회 | /posts/like | GET | Headers Auth : Bearer{token} | { "data": [ 
  { 
    "postId": 2, 
    "userId": 1, 
    "nickname": "Developer", 
    "title": “글제목1",   
    “content”:”글의내용1”,
    "createdAt": "2022-07-25T07:45:56.000Z", 
    "updatedAt": "Date 날짜", 
    "likes": 5 
  }, 
  { 
    "postId": 1, 
    "userId": 1, 
    "nickname": "Developer", 
    "title": "글제목2", 
    “content”:”글의내용2”,
    "createdAt": "Date 날짜", 
    "updatedAt": “Date 날짜", 
    "likes": 2
  } 
]} |  |
| 댓글 넣기 | /comments/:_postId | POST | Headers Auth : Bearer{token}
{
"content":"test1의 글1의 댓글3"
} | { 
message: "댓글을 생성하였습니다."
} |  |
| 댓글 목록 조회 | /comments/:_postId | GET |  | {
”commentId”:1,
”userId”:1,
”content:”test1의 글1의 댓글3”
} |  |
| 댓글 수정 | /comments/:_commentId | PUT | Headers Auth : Bearer{token}
{
"content":"test3의 글1의 수정된 댓글2"
} | { 
message: "댓글을 수정하였습니다." 
} |  |
| 댓글 삭제 | /comments/:_commentId | DELETE | Headers Auth : Bearer{token} | { 
success: true, 
message: "게시글을 삭제하였습니다." 
} |  |
