import API from "./api";

export const viewAllUsers = async () => {
  return await API.get(
    `/Admin/viewAllUsers`
  );
};

// Search User
export const searchUser = async (username) => {
  return await API.get(
    `/Admin/searchUser/${username}`
  );
};

// Delete User
export const deleteUser = async (username) => {
  return await API.delete(
    `/Admin/deleteUser`,
    {
      params: { username },
    }
  );
};

// Update User Password
export const updateUserPassword = async (
  username,
  password
) => {
  return await API.patch(
    `/Admin/updateUserPassword/${username}`,
    null,
    {
      params: { password },
    }
  );
};