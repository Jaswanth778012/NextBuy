import API from "./api";


// LOGIN
export const loginUser = async (data) => {
  return await API.post("/auth/login", data);
};


// REGISTER
export const registerUser = async (formData) => {
  return await API.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  return await API.post("/auth/forgot-password", {
    email,
  });
};


// VERIFY OTP
export const verifyOtp = async (email, otp) => {
  return await API.post("/auth/verify-otp", {
    email,
    otp,
  });
};


// RESET PASSWORD
export const resetPassword = async (
  email,
  newPassword,
  confirmPassword
) => {

  return await API.post("/auth/reset-password", {
    email,
    newPassword,
    confirmPassword,
  });
};

