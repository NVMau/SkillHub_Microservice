import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";



import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark", // Sử dụng chế độ tối
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#121212", // Nền tối
      paper: "#1e1e1e",
    },
  },
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 50% 50%, hsl(220, 30%, 10%), hsl(0, 0%, 5%))",
    backgroundRepeat: "no-repeat",
  },
}));

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      password: data.get("password"),
    });
  };

  const validateInputs = () => {
    const username = document.getElementById("username"); // Đổi từ 'email' thành 'username'
    const password = document.getElementById("password");

    let isValid = true;

    if (!username.value || username.value.length < 3) {
      // Kiểm tra username
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid username.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;  // Nếu validate thất bại, dừng việc đăng nhập
    }
    
    setLoading(true);
    setError("");
  
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", "skillhub_app");
    params.append("username", username);
    params.append("password", password);
    params.append("client_secret", "kUwFlob7oaWN4SGbv4EpRX35OSLKZ777");
    params.append("scope", "openid");
  
    try {
      const response = await axios.post(
        "http://localhost:8180/realms/vmaudev/protocol/openid-connect/token",
        params
      );
      const { access_token, refresh_token } = response.data;
  
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      console.log("Access Token:", access_token);
      console.log("Refresh Token:", refresh_token);
  
      navigate("/");
    } catch (error) {
      setSnackSeverity("error");
      console.error(error);
      setSnackBarMessage(
        error.response?.data?.message || "Đăng nhập thất bại do sai tài khoản hoặc mật khẩu"
      );
      setSnackBarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img
            src="https://course-service-files.s3.ap-southeast-2.amazonaws.com/logobig.png"
            alt="Logo"
            width="156"
            height="100"
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="username" sx={{ color: "white" }}>
                Username
              </FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                required
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{
                  backgroundColor: "#070c10",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl >
            <FormControl>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password" sx={{ color: "white" }}>
                  Password
                </FormLabel>
                <Link
                  component="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: "baseline", color: "#90caf9" }}
                >
                  Forgot your password?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ color: "white" }}
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleLogin} 
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: "center", color: "white" }}>
              Don&apos;t have an account?{" "}
              <span>
                <Link
                  href="/registration"
                  variant="body2"
                  sx={{ alignSelf: "center", color: "#90caf9" }}
                >
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Google")}
              startIcon={<GoogleIcon />}
              sx={{ borderColor: "#444", color: "white" }}
            >
              Sign in with Google
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Facebook")}
              startIcon={<FacebookIcon />}
              sx={{ borderColor: "#444", color: "white" }}
            >
              Sign in with Facebook
            </Button>
          </Box>
        </Card>
      </SignInContainer>
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
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
