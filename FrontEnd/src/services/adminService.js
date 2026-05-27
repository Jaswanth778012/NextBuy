import API from "./api"

export const globalSearch = async (
  keyword
) => {

  const response = await API.get(
    `/Admin/globalSearch?keyword=${keyword}`
  );

  return response.data;
};

// GET ADMIN PROFILE
export const getAdminProfile =
  async () => {

    return await API.get(
      "/Admin/profile"
    );
};

export const editAdminProfile =
  async (profileData) => {

    return await API.patch(
      "Admin/editProfile",
      profileData
    );
};