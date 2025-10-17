import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { registerUser } from "../../Redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    department:''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    if (formData.password.length < 6) {
      alert("Mật khẩu quá ngắn!");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }
    const newUser = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      department: formData.department,
    };
    //console.log(newUser)
    registerUser(newUser, dispatch, navigate);
    alert("Đăng ký thành công!");
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        backgroundColor: "#2b2b63",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: "90%", sm: "400px" },
          backgroundColor: "#2f2c56",
          padding: 4,
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Tiêu đề */}
        <Typography variant="h4" color="white" align="center" gutterBottom>
          Đăng Ký
        </Typography>
        <Typography
          variant="body2"
          color="#bdbdbd"
          align="center"
          sx={{ marginBottom: 3 }}
        >
          Tạo tài khoản của bạn để bắt đầu hành trình thú vị!
        </Typography>

        {/* Tên người dùng */}
        <TextField
          fullWidth
          name="username"
          label="Tên người dùng"
          value={formData.username}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#bdbdbd" } }}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#4b4970",
              color: "white",
            },
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#bdbdbd" } }}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#4b4970",
              color: "white",
            },
          }}
        />

        {/* department */}
        <Autocomplete
            // sx={{ marginTop: '15px !important'}}
            freeSolo
            options={['SMT', 'ME','PE', 'IPQC', 'MPE','RE', 'PD']}
            value={formData.department || ''}
            inputValue={formData.department || ''}
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                department: newValue || ''
              }))
            }}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                department: newInputValue || ''
              }))
            }}
            renderInput={(params) => (
                <TextField {...params} label="Bộ phận" fullWidth
                  InputLabelProps={{style:{color:'#bdbdbd'}}}
                  sx={{
                    marginBottom: 2,
                    "& .MuiInputBase-root": {
                      backgroundColor: "#4b4970",
                      color: "#fff",
                    },
                  }}
                >

                </TextField>
            )}
            
        />

        {/* Mật khẩu */}
        <TextField
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          value={formData.password}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#bdbdbd" } }}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#4b4970",
              color: "white",
            },
          }}
        />

        {/* Nhập lại mật khẩu */}
        <TextField
          fullWidth
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#bdbdbd" } }}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#4b4970",
              color: "white",
            },
          }}
        />

        {/* Checkbox đồng ý điều khoản */}
        <FormControlLabel
          control={
            <Checkbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              sx={{ color: "#bdbdbd" }}
            />
          }
          label="Tôi đồng ý với điều khoản sử dụng"
          sx={{ color: "#bdbdbd", marginBottom: 2 }}
        />

        {/* Nút Đăng ký */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#7367f0",
            "&:hover": { backgroundColor: "#5b52d1", transform: "scale(1.05)" },
            color: "white",
            padding: "10px",
            fontWeight: "bold",
            marginBottom: 3,
            transition: "transform 0.2s",
          }}
        >
          Đăng Ký
        </Button>

        {/* Đường dẫn đến trang Login */}
        <Typography align="center" color="#bdbdbd">
          Bạn đã có tài khoản?{" "}
          <Link
            to="/Home/Login"
            style={{
              color: "#7367f0",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Đăng nhập ngay
          </Link>
        </Typography>
      </Box>
    </Grid>
  );
};

export default RegisterPage;
