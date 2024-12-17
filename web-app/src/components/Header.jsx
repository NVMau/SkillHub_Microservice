import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useDarkMode } from "../DarkModeContext";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { getMyProfile } from "../services/userService";
import { submitOrder } from "../services/paymentService";
import { useProfile } from "../context/ProfileContext"; // Import useProfile

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CoinContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(0.2),
  paddingBottom: theme.spacing(0.1),
  paddingTop: theme.spacing(0.1),

  display: "flex",
  alignItems: "center",
}));

// const clearCookies = () => {
//   document.cookie.split(";").forEach((cookie) => {
//     document.cookie = cookie
//       .replace(/^ +/, "")
//       .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//   });
// };

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header() {
  const { profile, fetchProfile } = useProfile();
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const { darkMode, setDarkMode } = useDarkMode();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    console.log(profile.avatarUrl)
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    
    navigate("/profile"); // Điều hướng đến trang Profile
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Điều hướng về trang đăng nhập
    navigate("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 2 new mails" color="inherit">
          <Badge badgeContent={2} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 4 new notifications"
          color="inherit"
        >
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          {profile?.avatarUrl ? (
            <Box
              component="img"
              src={profile.avatarUrl} // Đường dẫn avatar của người dùng
              alt="User Avatar"
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%", // Làm tròn ảnh
                objectFit: "cover", // Đảm bảo ảnh không bị méo
              }}
            />
          ) : (
            <AccountCircle /> // Hiển thị icon mặc định nếu không có avatar
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const formatCurrency = (value) => {
    return Number(value)
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      })
      .replace("₫", "")
      .trim(); // Loại bỏ ký hiệu ₫ nếu không muốn hiển thị
  };
  const handleMoneyChange = (event) => {
    const input = event.target.value.replace(/\./g, ""); // Loại bỏ dấu chấm cũ
    setAmount(input); // Cập nhật giá trị nhập vào
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeposit = async () => {
    if (!profile.profileId) {
      console.error("Profile ID không tồn tại");
      return;
    }
    console.log(`Nạp số tiền: ${amount}`);
    try {
      const result = await submitOrder(amount, profile.profileId);
      console.log("Order submitted:", result.data);
      console.log("Order submitted:", result);
      window.location.href = result.data;
      fetchProfile();
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
      >
        <Box
          component={"img"}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: 6,
          }}
          src="/logo/skilhublogo.png"
        ></Box>
      </IconButton>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {/* Dark mode toggle button */}
        <IconButton
          size="large"
          edge="end"
          aria-label="toggle dark mode"
          color="inherit"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
        {/* Số dư và icon với nền đã được stylize */}
        <CoinContainer onClick={handleClickOpen}>
          <Typography
            variant="h7"
            sx={{
              paddingRight: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {profile ? profile.coin : "0"}
          </Typography>
          <MonetizationOnIcon /> {/* Icon coin bên cạnh số dư */}
        </CoinContainer>
      </Box>

      {/* Modal nạp tiền */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle textAlign={"center"}>Nạp tiền VNPay</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <img
              src="/logo/Logo-VNPAY-QR.png" // Đường dẫn đến logo
              alt="VNPay Logo"
              style={{ width: "150px" }} // Điều chỉnh kích thước nếu cần
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Nhập số tiền cần nạp (VND)"
            type="text" // Chuyển sang "text" để hiển thị số có dấu chấm
            fullWidth
            variant="standard"
            value={formatCurrency(amount)} // Định dạng số tiền
            onChange={handleMoneyChange} // Xử lý khi nhập giá trị
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleDeposit}>Nạp tiền</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </Box>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
