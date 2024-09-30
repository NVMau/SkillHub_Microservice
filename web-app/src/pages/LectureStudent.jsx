import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Link,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { getLecturesByCourseId } from "../services/lectureService"; // API service
import { useParams } from "react-router-dom"; // Import useParams để lấy courseId
import Scene from "./Scene";
import {
  createRating,
  getRatingbyCourseAndUser,
} from "../services/RatingsService";
import { getMyProfile } from "../services/userService";
import Loading from "../components/Loading"; // Component Loading

import {
  getAssignmentsByLectureId,
  submitExamResult,
  getExamResultByLectureId, // API để lấy kết quả bài thi
} from "../services/examResultService"; // Service để lấy bài tập và gửi kết quả

export default function LecturePage() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [lectures, setLectures] = useState([]);
  const [assignment, setAssignment] = useState(null); // Lưu bài tập hiện tại
  const [examResult, setExamResult] = useState(null); // Lưu kết quả bài thi nếu đã làm
  const [userAnswers, setUserAnswers] = useState({}); // Trạng thái để lưu câu trả lời của người dùng
  const [loadingAssignment, setLoadingAssignment] = useState(false); // Để kiểm tra trạng thái load bài tập
  const [selectedLectureId, setSelectedLectureId] = useState(null); // Theo dõi bài giảng được chọn để làm bài
  const [profile, setProfile] = useState({});
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [hasRated, setHasRated] = useState(false); // Define the hasRated state

  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const getProfile = async () => {
    try {
      const response = await getMyProfile();
      const data = response.data;

      console.log("Response data:", data); // In ra dữ liệu response

      setProfile(data);
    } catch (error) {
      const errorResponse = error.response?.data;
      console.log("errorResponse data:", errorResponse);
    }
  };

  const handleSubmitReview = async () => {
    const studentId = profile.profileId;

    if (!stars || !comment) {
      alert("Vui lòng đánh giá và viết nhận xét!");
      return;
    }
    try {
      console.log(studentId, courseId, stars, comment);
      await createRating({ studentId, courseId, stars, comment });
      setSnackSeverity("success");
      setSnackBarMessage("Đánh gía thành công");
      setSnackBarOpen(true);
      setIsLoading(false);
    } catch (error) {
      const errorResponse = error.response?.data;
      setSnackSeverity("error");
      console.log("errorResponse data:", error);
      setIsLoading(false);

      // Kiểm tra xem lỗi có phải là do đã đăng ký khóa học trước đó

      setSnackBarMessage("Lỗi khi thực hiện đánh giá");

      setSnackBarOpen(true);

      // Gửi dữ liệu rating và review lên backend tại đây.
    }
  };

  useEffect(() => {
    const fetchLecturesAndResults = async () => {
      try {
        // Lấy danh sách bài giảng
        const response = await getLecturesByCourseId(courseId);
        const lectures = response.data;
        setIsLoading(false);

        // Kiểm tra từng bài giảng xem có kết quả bài thi hay không
        for (let lecture of lectures) {
          const assignmentResponse = await getAssignmentsByLectureId(
            lecture.id
          );

          if (assignmentResponse.data && assignmentResponse.data.length > 0) {
            const assignment = assignmentResponse.data[0];

            // Kiểm tra kết quả bài thi cho từng assignment
            const examResultResponse = await getExamResultByLectureId(
              assignment.id,
              profile.profileId
            );

            if (examResultResponse?.data) {
              // Nếu có kết quả, lưu kết quả vào state
              lecture.examResult = examResultResponse.data;
            } else {
              // Nếu chưa có kết quả, lưu assignment
              lecture.assignment = assignment;
              // Trộn câu trả lời nếu chưa làm
              lecture.assignment.questions = assignment.questions.map(
                (question) => ({
                  ...question,
                  shuffledOptions: shuffleArray(question.options),
                })
              );
            }
          }
        }

        setLectures(lectures);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài giảng hoặc bài thi:", error);
      }
    };
    const fetchRating = async () => {
      try {
        const response = await getRatingbyCourseAndUser(
          courseId,
          profile.profileId
        );
        if (response.data) {
          // Đã có đánh giá
          setStars(response.data.stars);
          setComment(response.data.comment);
          setHasRated(true); // Đặt trạng thái đã đánh giá
        }
      } catch (error) {
        console.error("Error fetching rating", error);
      }
    };

    // Lấy thông tin profile trước khi gọi API bài giảng
    const loadProfileAndLectures = async () => {
      await getProfile();
      fetchLecturesAndResults();
    };

    fetchRating();
    loadProfileAndLectures();
  }, [courseId, profile.profileId]);

  // Xử lý khi học sinh chọn câu trả lời
  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Gửi kết quả bài tập
  const handleSubmitExam = async () => {
    try {
      const resultPayload = {
        userAnswers: Object.values(userAnswers),
      };
      // Gửi câu trả lời đến backend
      await submitExamResult(assignment.id, profile.profileId, resultPayload);
      alert("Bài thi đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi bài thi:", error);
      alert("Lỗi khi gửi bài thi.");
    }
  };

  // Lấy bài tập cho từng bài giảng khi học sinh muốn làm bài
  const handleFetchAssignment = async (lectureId) => {
    setLoadingAssignment(true);
    setSelectedLectureId(lectureId);

    if (!profile?.profileId) {
      console.error("Profile ID is not ready yet.");
      setLoadingAssignment(false);
      return;
    }

    try {
      // Lấy bài tập trước
      const assignmentResponse = await getAssignmentsByLectureId(lectureId);
      if (assignmentResponse.data && assignmentResponse.data.length > 0) {
        const assignment = assignmentResponse.data[0];

        // Kiểm tra xem đã có kết quả bài thi chưa
        const examResultResponse = await getExamResultByLectureId(
          assignment.id,
          profile.profileId
        );

        if (examResultResponse?.data) {
          // Nếu đã có kết quả bài thi, hiển thị kết quả và không cho phép làm bài
          setExamResult(examResultResponse.data);
          setAssignment(null); // Không hiển thị assignment nếu đã có kết quả
        } else {
          // Nếu chưa có kết quả, trộn câu trả lời và hiển thị bài tập
          assignment.questions = assignment.questions.map((question) => ({
            ...question,
            shuffledOptions: shuffleArray(question.options),
          }));
          setAssignment(assignment);
          setExamResult(null); // Reset kết quả bài thi
        }
      } else {
        setAssignment(null);
        alert("Không có bài tập nào cho bài giảng này.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài tập hoặc kết quả:", error);
      setAssignment(null);
    } finally {
      setLoadingAssignment(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Scene>
      <Box sx={{ padding: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "left", fontWeight: "bold" }} // Canh giữa chữ
        >
          DANH SÁCH BÀI GIẢNG
        </Typography>

        <Grid container spacing={3}>
          {lectures.map((lecture) => (
            <Grid item xs={12} md={12} key={lecture.id}>
              <Card
                sx={{
                  height: "100%", // Chiều cao của card chiếm toàn bộ khung
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

                  {/* Hiển thị file PDF nếu có */}
                  {lecture.fileUrl && (
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: 2,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
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
                  {/* Hiển thị nhiều video nếu có */}
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

                  {examResult && selectedLectureId === lecture.id ? (
                    <Box sx={{ mt: 5 }}>
                      <Typography variant="h5" gutterBottom>
                        Điểm của bạn: {examResult.score}
                      </Typography>
                      {examResult.questionResults.map((result, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 3,
                            p: 2,
                            border: "1px solid",
                            borderColor: result.correct ? "green" : "red",
                            backgroundColor: result.correct
                              ? "rgba(0, 255, 0, 0.1)"
                              : "rgba(255, 0, 0, 0.1)",
                            borderRadius: "5px",
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            Câu {index + 1}: {result.questionText}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: result.correct ? "green" : "red",
                              fontWeight: "bold",
                            }}
                          >
                            Câu trả lời của bạn: {result.userAnswer}{" "}
                            {result.correct ? "(Đúng)" : "(Sai)"}
                          </Typography>
                          <Typography variant="body2">
                            Đáp án đúng: {result.correctAnswer}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <>
                      {/* Hiển thị nút làm bài tập nếu chưa làm */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFetchAssignment(lecture.id)}
                        sx={{ mt: 2 }}
                      >
                        Xem bài tập
                      </Button>

                      {/* Hiển thị loading khi đang lấy bài tập */}
                      {loadingAssignment &&
                        selectedLectureId === lecture.id && (
                          <Typography
                            variant="body1"
                            sx={{ textAlign: "center", mt: 3 }}
                          >
                            Đang tải bài tập...
                          </Typography>
                        )}

                      {/* Hiển thị bài tập nếu chưa làm */}
                      {examResult && selectedLectureId === lecture.id ? (
                        <Box sx={{ mt: 5 }}>
                          <Typography variant="h5" gutterBottom>
                            Điểm của bạn: {examResult.score}
                          </Typography>
                          {examResult.questionResults.map((result, index) => (
                            <Box
                              key={index}
                              sx={{
                                mb: 3,
                                p: 2,
                                border: "1px solid",
                                borderColor: result.correct ? "green" : "red",
                                backgroundColor: result.correct
                                  ? "rgba(0, 255, 0, 0.1)"
                                  : "rgba(255, 0, 0, 0.1)",
                                borderRadius: "5px",
                              }}
                            >
                              <Typography variant="body1" fontWeight="bold">
                                Câu {index + 1}: {result.questionText}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: result.correct ? "green" : "red",
                                  fontWeight: "bold",
                                }}
                              >
                                Câu trả lời của bạn: {result.userAnswer}{" "}
                                {result.correct ? "(Đúng)" : "(Sai)"}
                              </Typography>
                              <Typography variant="body2">
                                Đáp án đúng: {result.correctAnswer}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <>
                          {/* Phần render bài tập nếu chưa có kết quả */}
                          {assignment &&
                          selectedLectureId === lecture.id &&
                          assignment.questions &&
                          assignment.questions.length > 0 ? (
                            <Box sx={{ mt: 5 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                              >
                                {assignment.title || "Bài tập không có tiêu đề"}
                              </Typography>
                              {assignment.questions.map((question, index) => (
                                <Box key={index} sx={{ mb: 3 }}>
                                  <Typography variant="body1">
                                    Câu {index + 1}: {question.questionText}
                                  </Typography>

                                  <RadioGroup
                                    name={`question-${index}`}
                                    value={userAnswers[index] || ""}
                                    onChange={(e) =>
                                      handleAnswerChange(index, e.target.value)
                                    }
                                  >
                                    {question.shuffledOptions.map(
                                      (option, optionIndex) => (
                                        <FormControlLabel
                                          key={optionIndex}
                                          value={option}
                                          control={<Radio />}
                                          label={option}
                                        />
                                      )
                                    )}
                                  </RadioGroup>
                                </Box>
                              ))}
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitExam}
                                sx={{ mt: 2 }}
                              >
                                Nộp bài
                              </Button>
                            </Box>
                          ) : (
                            !loadingAssignment &&
                            selectedLectureId === lecture.id && (
                              <Typography
                                variant="body1"
                                sx={{ mt: 3, textAlign: "center" }}
                              >
                                Không có bài tập nào được tìm thấy.
                              </Typography>
                            )
                          )}
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 5 }}>
          {hasRated ? (
            <Box>
              <Typography variant="h6">Bạn đã đánh giá khóa học này</Typography>
              <Rating value={stars} readOnly />
              <Typography>{comment}</Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">Đánh giá khóa học</Typography>
              <Rating
                value={stars}
                onChange={(event, newValue) => setStars(newValue)}
              />
              <TextField
                fullWidth
                label="Nhận xét của bạn"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={4}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReview}
                sx={{ mt: 2 }}
              >
                Gửi đánh giá
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Scene>
  );
}
