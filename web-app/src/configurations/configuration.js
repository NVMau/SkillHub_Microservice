export const CONFIG = {
  API_GATEWAY: "http://localhost:9000",
};

export const API = {

  //API cho User
  REGISTRATION: "/api/profiles/register",
  MY_PROFILE: "/api/profiles/my-profile",
  USERREGISTERCOURSE: "/api/profiles/courses",
  

  GET_ALL_USERS:"/api/profiles/all-profiles",
  UPDATE_USER: "/api/profiles/user",

  DELETE_USER: "/api/profiles/delete-user",
  SEARCH_USERS:"/api/profiles/search",




  //API cho khóa học 
  CREATE_COURSE: "/api/courses",
  GET_TEACHERS_COURSES: "/api/profiles/teacher-courses",
  GET_TEACHERS: "/api/profiles/teachers",
  GET_ALLCOURSE: "/api/courses/search",
  REGISTER_COURSE: "/api/enrollments",
  DELETE_COURSE:"/api/courses",
  UPDATE_COURSE: "/api/courses",
  GETALL_COURSE_BYTEACHERID: "/api/courses/teacher",

  



  //API bài giảng 
  GET_LECTURES_BY_COURSE: "/api/lectures/course",  // API lấy bài giảng

  CREATE_LECTURE: "/api/lectures",  // API thêm bài giảng


  //APi Cho bài tập 
  CREATE_ASSIGNMENT: "/api/assignments",

  GET_ASSIGNMENTS_BY_LECTURE: "/api/assignments/lecture",


  SUBMIT_EXAM_RESULT: "/api/exam-results",
  GET_EXAMRESULT_BY_LECTURE: "/api/exam-results/assignment",


  //Payment 
  PAYMENT: "/api/profiles/submitOrder",

  //API cho thống kê
  USER_COUNT_SYS: "/api/profiles/user-count",


  //Đếm số lượng người dung trong khóa học 
  
  COUNT_USER_REGIST:"/api/enrollments/course",

  UPDATE_AVATAR: "/api/profiles/update-avatar",



  //Blog 
  GET_ALL_POST:"/api/blog/posts",
  CREATE_POST:"/api/blog/posts",

  GET_COMMENTBYPOSTID:"/api/blog/comments",

  ADD_COMMENT:"/api/blog/comments",

  GET_INTERACTIONBYPOSTID: "/api/blog/interactions",

  ADD_INTERACTION: "/api/blog/interactions",



  //Rating 
  CREATE_RATING:"/api/enrollments/ratings/rate",
  GET_RATING: "/api/enrollments/ratings/course",


  //Chat AI
  SENDCHAT: "/api/chat/message",















  
};

export const KEYCLOAK_CONFIG = {
  url: "http://localhost:8180",
  realm: "vmaudev",
  clientId: "skillhub_webapp",
};
