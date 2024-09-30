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
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import { GoogleIcon, FacebookIcon } from "./CustomIcons";
import { register } from "../../services/userService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: "dark", // Dark mode for the form
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#121212", // Dark background
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp(props) {
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("ROLE_STUDENT"); // Default role
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let isValid = true;

    // Validate Username
    if (!username || username.length < 3) {
      setUsernameError(true);
      setUsernameErrorMessage("Username must be at least 3 characters long.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // Validate Email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Validate Password
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    // If all inputs are valid, send the registration data
    if (isValid) {
      try {
        const data = {
          username: username,
          password: password,
          firstName: firstname, // Ensure firstname and lastname are declared elsewhere in your code
          lastName: lastname,
          email: email,
          roles: [role], // Ensure role is defined and correctly handled
        };

        let response = await register(data);
        console.log("User registered successfully:", response.data);

        // Hiển thị thông báo thành công và chuyển về trang đăng nhập
        // Hiển thị thông báo thành công và chuyển về trang đăng nhập
        setSnackSeverity("success");
        setSnackBarMessage("Registration completed successfully!");
        setSnackBarOpen(true);

        // Chuyển về trang đăng nhập sau khi thông báo hiển thị 2 giây
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackBarOpen(false)} severity={snackSeverity}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <SignUpContainer direction="column" justifyContent="space-between">
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
            Sign Up
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
            {/* Username */}
            <FormControl>
              <FormLabel htmlFor="username" sx={{ color: "white" }}>
                Username
              </FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMessage}
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                required
                fullWidth
                variant="outlined"
                color={usernameError ? "error" : "primary"}
                sx={{
                  backgroundColor: "#070c10",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl>

            {/* Email */}
            <FormControl>
              <FormLabel htmlFor="email" sx={{ color: "white" }}>
                Email
              </FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{
                  backgroundColor: "#070c10",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl>

            {/* Lastname */}
            <FormControl>
              <FormLabel htmlFor="lastname" sx={{ color: "white" }}>
                Lastname
              </FormLabel>
              <TextField
                id="lastname"
                type="text"
                name="lastname"
                placeholder="Enter your lastname"
                autoComplete="lastname"
                required
                value={lastname}
                fullWidth
                variant="outlined"
                onChange={(e) => setLastname(e.target.value)}
                sx={{
                  backgroundColor: "#070c10",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl>

            {/* Firstname */}
            <FormControl>
              <FormLabel htmlFor="firstname" sx={{ color: "white" }}>
                Firstname
              </FormLabel>
              <TextField
                id="firstname"
                type="text"
                name="firstname"
                placeholder="Enter your firstname"
                autoComplete="firstname"
                required
                value={firstname}
                fullWidth
                variant="outlined"
                onChange={(e) => setFirstname(e.target.value)}
                sx={{
                  backgroundColor: "#070c10",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl>

            {/* Password */}
            <FormControl>
              <FormLabel htmlFor="password" sx={{ color: "white" }}>
                Password
              </FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
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

            {/* Confirm Password */}
            <FormControl>
              <FormLabel htmlFor="confirmPassword" sx={{ color: "white" }}>
                Confirm Password
              </FormLabel>
              <TextField
                error={confirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                name="confirmPassword"
                placeholder="••••••"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                required
                fullWidth
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                color={confirmPasswordError ? "error" : "primary"}
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  input: { color: "white" },
                }}
              />
            </FormControl>
            {/* Chọn Role */}
            <FormControl fullWidth margin="normal">
              <FormLabel id="role-select-label" sx={{ color: "white" }}>
                Role
              </FormLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  input: { color: "white" },
                }}
              >
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
                <MenuItem value="ROLE_TEACHER">Teacher</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="terms" color="primary" />}
              label="I agree to the Terms and Conditions"
              sx={{ color: "white" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            >
              Sign Up
            </Button>
            <Typography sx={{ textAlign: "center", color: "white" }}>
              Already have an account?{" "}
              <Link href="/login" variant="body2" sx={{ color: "#90caf9" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Google")}
              startIcon={<GoogleIcon />}
              sx={{ borderColor: "#444", color: "white" }}
            >
              Sign up with Google
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Facebook")}
              startIcon={<FacebookIcon />}
              sx={{ borderColor: "#444", color: "white" }}
            >
              Sign up with Facebook
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </ThemeProvider>
  );
}
