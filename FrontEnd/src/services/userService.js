import API from "./api";

const userService = {
    // GET /User/profile
    getMyProfile: () => API.get("/User/profile"),

    // PATCH /User/updateProfile
    // Sends multipart: user (JSON blob) + img (file, optional)
    updateProfile: (profileData, imageFile) => {
        const formData = new FormData();
        
        // Backend expects @RequestPart("user") as JSON
        const userBlob = new Blob([JSON.stringify(profileData)], { 
            type: "application/json" 
        });
        formData.append("user", userBlob);
        
        // Backend expects @RequestPart(value="img", required = false)
        if (imageFile) {
            formData.append("img", imageFile);
        }
        
        return API.patch("/User/updateProfile", formData, {
            headers: {
                // Don't set Content-Type — browser sets it with boundary for multipart
            }
        });
    },

    // PATCH /User/passwordUpdated/{oldpassword}/{newpassword}/{Confirm}
    changePassword: (oldPassword, newPassword, confirmPassword) => 
        API.patch(`/User/passwordUpdated/${encodeURIComponent(oldPassword)}/${encodeURIComponent(newPassword)}/${encodeURIComponent(confirmPassword)}`),

    // DELETE /User/deleteProfile/{username}/{oldpassword}
    deleteProfile: (username, oldPassword) => 
        API.delete(`/User/deleteProfile/${encodeURIComponent(username)}/${encodeURIComponent(oldPassword)}`)
};

export default userService;