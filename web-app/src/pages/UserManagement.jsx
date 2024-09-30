import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Scene from "./Scene"; // Dùng Scene để bọc nội dung
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService"; // Các API thao tác với backend

export default function UserManagement() {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [openAddDialog, setOpenAddDialog] = useState(false); // Để mở hoặc đóng dialog thêm người dùng
  const [openEditDialog, setOpenEditDialog] = useState(false); // Để mở dialog sửa người dùng
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  
  // Lưu người dùng được chọn để sửa
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  }); // Thông tin người dùng mới
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    coin: 0,
  }); // Thông tin người dùng để sửa

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm thêm người dùng mới
  const handleAddUser = async () => {
    try {
      await createUser(newUser);
      fetchUsers(); // Load lại danh sách người dùng sau khi thêm
      setOpenAddDialog(false);
      setNewUser({ username: "", email: "", firstName: "", lastName: "" }); // Reset form
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  // Hàm mở dialog sửa người dùng và gán thông tin vào form
  const handleEditUserOpen = (user) => {
    setEditUser(user); // Gán thông tin người dùng vào form để sửa
    setOpenEditDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete.profileId); // Xóa người dùng thông qua API
      setOpenDeleteDialog(false); // Đóng dialog sau khi xóa thành công
      fetchUsers(); // Load lại danh sách người dùng sau khi xóa
      alert("Xóa người dùng thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Lỗi khi xóa người dùng.");
    }
  };

  const handleDeleteDialogOpen = (user) => {
    setUserToDelete(user); // Lưu thông tin người dùng vào state
    setOpenDeleteDialog(true); // Mở dialog xác nhận xóa
  };
  // Hàm cập nhật người dùng
  const handleUpdateUser = async () => {
    try {
      await updateUser(editUser);
      fetchUsers(); // Load lại danh sách sau khi cập nhật
      setOpenEditDialog(false); // Đóng dialog sửa người dùng
      setEditUser({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        dob: "",
        coin: 0,
      }); // Reset form
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // Hàm xóa người dùng
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers(); // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <Scene>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Chiếm toàn bộ khung hình
          width: "100%",
        }}
      >
        <Card
          sx={{
            width: "95%",
            boxShadow: 3,
            borderRadius: 2,
            padding: 4,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h4" component="h2" mb={4} textAlign={"center"} fontWeight="bold">
            Quản lý người dùng
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddDialog(true)}
            mb={2}
            sx={{ mb: 2,   alignSelf: 'end'}}
          >
            Thêm người dùng
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Họ</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Coin</TableCell>
                  <TableCell>Vai trò </TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <img
                        src={user.avatarUrl} // Sử dụng URL của avatar
                        alt="avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }} // Tạo hình ảnh tròn
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.coin}</TableCell>
                    <TableCell>{user.roles.join(", ")}</TableCell>

                    <TableCell>
                      <IconButton onClick={() => handleEditUserOpen(user)}>
                        <Edit />
                      </IconButton>
                      {/* Chỉ hiển thị nút xóa cho ROLE_STUDENT */}
                      {user.roles.includes("ROLE_STUDENT") && (
                        <IconButton onClick={() => handleDeleteDialogOpen(user)}>
                        <Delete />
                      </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          
        </Card>

        {/* Dialog Thêm người dùng */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Thêm người dùng</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
            <Button onClick={handleAddUser} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Sửa người dùng */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Sửa người dùng</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={editUser.profileId}
              disabled // Không cho phép sửa username
            />
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={editUser.username}
              disabled // Không cho phép sửa username
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={editUser.firstName}
              onChange={(e) =>
                setEditUser({ ...editUser, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={editUser.lastName}
              onChange={(e) =>
                setEditUser({ ...editUser, lastName: e.target.value })
              }
            />
            <TextField
              label="Coin"
              fullWidth
              margin="normal"
              type="number"
              value={editUser.coin}
              onChange={(e) =>
                setEditUser({ ...editUser, coin: e.target.value })
              }
            />
            <TextField
              label="Date of Birth"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editUser.dob}
              onChange={(e) =>
                setEditUser({ ...editUser, dob: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button onClick={handleUpdateUser} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>


         {/* Dialog Xác nhận xóa */}
         <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa người dùng này không?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Scene>
  );
}
