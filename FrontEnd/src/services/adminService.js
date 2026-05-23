import API from "./api"

export const globalSearch = async (
  keyword
) => {

  const response = await API.get(
    `/Admin/globalSearch?keyword=${keyword}`
  );

  return response.data;
};