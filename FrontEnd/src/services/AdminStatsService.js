import API from "./api";

// GET TOTAL STATS
export const getTotalStats = async () => {
  return await API.get("/AdminStats/getTotalStats");
};
