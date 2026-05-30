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



// CHANGE PASSWORD
export const changeAdminPassword =
  async (
    username,
    password,
    newPass
  ) => {

    return await API.patch(

      `/Admin/adminUpdate/${username}/${password}?newPass=${newPass}`

    );
};

export const updateUserPassword =
  async (username, password) => {

    return await API.patch(

      `/Admin/updateUserPassword/${username}/${password}`

    );
};
export const deleteUser =
  async (username) => {

    return await API.delete(

      `/Admin/deleteUser?username=${username}`

    );
};

export const makeUserToAdmin =
  async (
    email,
    username,
    password
  ) => {

    return await API.patch(

      `/Admin/makeUserToAdmin/${email}/${username}/${password}`

    );
};

export const deleteAdmin =
  async (username, password) => {

    return await API.delete(

      `/Admin/deleteAdmin/${username}/${password}`

    );
};

