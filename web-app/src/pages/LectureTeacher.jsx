import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Link,
} from "@mui/material";
import keycloak from "../keycloak"; // Keycloak to get user roles
import {
  getLecturesByCourseId,
  createLecture,
} from "../services/lectureService"; // API service
import { useParams } from "react-router-dom"; // Import useParams để lấy courseId
import Scene from "./Scene";
import {
  createAssignment,
  getAssignmentsByLectureId,
} from "../services/assignmentService";
import useUserRoles from "../services/useUserRoles"; 
export default function LectureTeacher() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({
    title: "",
    content: "",
    file: null,
    videos: [],
  });
  const [previewVideo, setPreviewVideo] = useState([]); // Hiển thị video preview
  const userRoles = useUserRoles(); 
  // Get user roles

  // Trạng thái để theo dõi câu hỏi của từng bài giảng
  const [lectureQuestions, setLectureQuestions] = useState({});
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    description: "",
  });
  const [lectureAssignments, setLectureAssignments] = useState({});
  // Lấy danh sách bài giảng và khởi tạo câu hỏi cho mỗi bài giảng
  // Lấy danh sách bài giảng và bài tập
  useEffect(() => {
    const fetchLecturesAndAssignments = async () => {
      try {
        // Lấy danh sách bài giảng
        const response = await getLecturesByCourseId(courseId);
        const lecturesData = response.data;
        setLectures(lecturesData);

        // Khởi tạo mảng câu hỏi cho từng bài giảng
        const initialQuestions = lecturesData.reduce((acc, lecture) => {
          acc[lecture.id] = []; // Mỗi bài giảng có mảng câu hỏi riêng
          return acc;
        }, {});
        setLectureQuestions(initialQuestions);

        // Lấy bài tập cho từng bài giảng
        const assignmentsMap = {};
        for (const lecture of lecturesData) {
          const assignmentResponse = await getAssignmentsByLectureId(
            lecture.id
          );
          assignmentsMap[lecture.id] = assignmentResponse.data;
        }
        setLectureAssignments(assignmentsMap);
      } catch (error) {
        console.error("Error fetching lectures or assignments:", error);
      }
    };

    fetchLecturesAndAssignments();
  }, [courseId]);

  // Xử lý chọn video
  const handleVideoChange = (e) => {
    const selectedVideos = Array.from(e.target.files); // Chuyển filelist thành array
    setNewLecture({ ...newLecture, videos: selectedVideos });

    const previewUrls = selectedVideos.map((video) =>
      URL.createObjectURL(video)
    );
    setPreviewVideo(previewUrls);
  };

  // Xử lý thêm bài giảng
  const handleCreateLecture = async () => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", newLecture.title);
    formData.append("content", newLecture.content);
    formData.append("file", newLecture.file);

    newLecture.videos.forEach((video) => {
      formData.append("videos", video); // Thêm video vào form data
    });

    try {
      await createLecture(formData);
      alert("Bài giảng đã được thêm thành công!");
      const response = await getLecturesByCourseId(courseId);
      setLectures(response.data); // Làm mới danh sách bài giảng
      
    } catch (error) {
      console.error("Error creating lecture:", error);
      alert("Lỗi khi thêm bài giảng.");
    }
  };

  // Xử lý thêm bài tập
  const handleCreateAssignment = async (lectureId) => {
    try {
      const processedQuestions = lectureQuestions[lectureId].map(
        (question) => ({
          ...question,
          correctAnswer: question.options[0], // Mặc định câu trả lời đầu tiên là đúng
        })
      );

      const payload = {
        lectureId: lectureId,
        title: newAssignment.name,
        questions: processedQuestions,
      };
      console.log("Sending assignment data:", payload); // Xuất dữ liệu gửi đi ra console

      await createAssignment(payload);
      alert("Bài tập đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm bài tập:", error);
      alert("Lỗi khi thêm bài tập.");
    }
  };

  // Thay đổi câu hỏi
  const handleQuestionTextChange = (lectureId, index, value) => {
    setLectureQuestions((prev) => ({
      ...prev,
      [lectureId]: prev[lectureId].map((question, i) =>
        i === index ? { ...question, questionText: value } : question
      ),
    }));
  };

  // Thay đổi lựa chọn
  const handleOptionChange = (lectureId, questionIndex, optionIndex, value) => {
    setLectureQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions[lectureId]];
      newQuestions[questionIndex].options[optionIndex] = value;

      // Tự động gán câu trả lời đầu tiên là đúng
      if (optionIndex === 0) {
        newQuestions[questionIndex].correctAnswer = value;
      }

      return { ...prevQuestions, [lectureId]: newQuestions };
    });
  };

  // Thêm câu hỏi mới
  const addNewQuestion = (lectureId) => {
    setLectureQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions[lectureId]];
      newQuestions.push({
        questionText: "",
        options: ["", "", "", ""], // Tạo ít nhất 2 lựa chọn trống
        correctAnswer: "",
      });
      return { ...prevQuestions, [lectureId]: newQuestions };
    });
  };

  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "leftl", fontWeight: "bold" }}
        >
          DANH SÁCH BÀI GIẢNG
        </Typography>

        <Grid container spacing={3}>
          {lectures.map((lecture) => (
            <Grid item xs={12} md={12} key={lecture.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  margin: "0 auto",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    textAlign={"center"}
                    fontWeight={"bold"}
                    paddingBottom={10}
                  >
                    {lecture.title}
                  </Typography>
                  <Typography variant="h7" color="textSecondary">
                    <strong>Nội dung chính:</strong> {lecture.content}
                  </Typography>
                  {lecture.fileUrl && (
                    <Box sx={{ display: "flex", marginTop: 2, flexDirection: "row",  alignItems: "center" }}>
                      <Typography variant="h7" fontWeight={"bold"}>
                        Tài liệu:
                      </Typography>
                      <Link
                        href={lecture.fileUrl}
                        target="_blank"
                        rel="noopener"
                        paddingRight={2}
                        variant="h7"
                      >
                        {lecture.fileUrl.split("/").pop()}
                      </Link>
                    </Box>
                  )}

                  {lecture.videoUrls && lecture.videoUrls.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="h6" fontWeight={"bold"}>
                        Video về bài giảng:
                      </Typography>
                      {lecture.videoUrls.map((videoUrl, index) => (
                        <Box
                          key={index}
                          sx={{ marginBottom: 4, marginLeft: 4 }}
                        >
                          <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            {`Video ${index + 1}:`}
                          </Typography>
                          <CardMedia
                            component="video"
                            height="300"
                            controls
                            src={videoUrl}
                            sx={{ marginTop: 2 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {lectureAssignments[lecture.id] &&
                  lectureAssignments[lecture.id].length > 0 ? (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Bài tập:
                      </Typography>
                      {lectureAssignments[lecture.id].map((assignment) => (
                        <Box key={assignment.id} sx={{ mb: 3, paddingLeft: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {assignment.title}
                          </Typography>
                          {assignment.questions.map((question, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold" }}
                              >
                                Câu {index + 1}: {question.questionText}
                              </Typography>
                              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                                {question.options.map((option, optionIndex) => (
                                  <Box
                                    component="li"
                                    key={optionIndex}
                                    sx={{
                                      fontWeight:
                                        option === question.correctAnswer
                                          ? "bold"
                                          : "normal",
                                      color:
                                        option === question.correctAnswer
                                          ? "green"
                                          : "inherit",
                                    }}
                                  >
                                    {option}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    (userRoles.includes("ROLE_ADMIN") ||
                      userRoles.includes("ROLE_TEACHER")) && (
                      <Box sx={{ mt: 3 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                          paddingBottom={2}
                        >
                          Bài Tập:
                        </Typography>

                        {/* Thêm trường nhập tiêu đề cho bài tập */}
                        <TextField
                          label="Tiêu đề bài tập"
                          value={newAssignment.name} // Trạng thái lưu tiêu đề bài tập
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              name: e.target.value,
                            })
                          }
                          fullWidth
                          sx={{ mb: 3 }}
                        />

                        {/* Form thêm bài tập cho từng bài giảng */}
                        {lectureQuestions[lecture.id]?.map(
                          (question, index) => (
                            <Box key={index} sx={{ mb: 3, paddingLeft: 3 }}>
                              <Typography paddingBottom={2} fontWeight={"bold"}>
                                Câu hỏi {index + 1}:{" "}
                              </Typography>
                              <TextField
                                label="Câu hỏi"
                                value={question.questionText}
                                onChange={(e) =>
                                  handleQuestionTextChange(
                                    lecture.id,
                                    index,
                                    e.target.value
                                  )
                                }
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                              <Typography paddingBottom={2} fontWeight={"bold"}>
                               Nhập các lựa chọn {index + 1}:
                              </Typography>
                              {question.options.map((option, optionIndex) => (
                                <TextField 
                                  
                                  key={optionIndex}
                                  label={`Lựa chọn ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      lecture.id,
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                  sx={{ mb: 2 }}
                                />
                              ))}
                            </Box>
                          )
                        )}

                        <Button
                          variant="outlined"
                          onClick={() => addNewQuestion(lecture.id)}
                          sx={{ mb: 2 }}
                        >
                          Thêm câu hỏi
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          fullWidth
                          onClick={() => handleCreateAssignment(lecture.id)}
                        >
                          Thêm bài tập
                        </Button>
                      </Box>
                    )
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Render form for creating a new lecture */}
        {userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_TEACHER") ? (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Thêm bài giảng mới
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nhập tên bài giảng"
                  value={newLecture.title}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, title: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nhập nội dung chính"
                  value={newLecture.content}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, content: e.target.value })
                  }
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Chọn file bài giảng (PDF/Word)
                  <input
                    type="file"
                    accept="application/pdf, application/msword"
                    hidden
                    onChange={(e) =>
                      setNewLecture({ ...newLecture, file: e.target.files[0] })
                    }
                  />
                </Button>
              </Grid>

              {/* Hiển thị preview PDF */}
              {newLecture.file &&
                newLecture.file.type === "application/pdf" && (
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Xem trước tài liệu PDF:
                    </Typography>
                    <iframe
                      src={URL.createObjectURL(newLecture.file)}
                      width="100%"
                      height="500px"
                    ></iframe>
                  </Grid>
                )}
              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Chọn Video bài giảng (mp4)
                  <input
                    type="file"
                    accept="video/mp4"
                    multiple // Cho phép chọn nhiều video
                    hidden
                    onChange={handleVideoChange} // Hàm xử lý sẽ cần điều chỉnh để nhận nhiều file
                  />
                </Button>
              </Grid>
              {/* Hiển thị preview cho tất cả các video đã chọn */}
              {previewVideo && previewVideo.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Xem trước video:</Typography>
                  {previewVideo.map((videoUrl, index) => (
                    <CardMedia
                      key={index}
                      component="video"
                      height="300"
                      controls
                      src={videoUrl}
                      sx={{ marginTop: 2 }}
                    />
                  ))}
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleCreateLecture}
                  fullWidth
                >
                  Thêm bài giảng
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Box>
    </Scene>
  );
}
