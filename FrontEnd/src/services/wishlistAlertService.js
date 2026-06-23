import API from "./api";

export const getAlerts = async () => {
  const response = await API.get(
    "/wishlist-alerts"
  );

  return response.data;
};

export const getActiveAlerts = async () => {
  const response = await API.get(
    "/wishlist-alerts/active"
  );

  return response.data;
};

export const createAlert = async (
  alertData
) => {
  const response = await API.post(
    "/wishlist-alerts",
    alertData
  );

  return response.data;
};

export const updateAlert = async (
  alertId,
  alertData
) => {
  const response = await API.put(
    `/wishlist-alerts/${alertId}`,
    alertData
  );

  return response.data;
};

export const toggleAlert = async (
  alertId
) => {
  const response = await API.patch(
    `/wishlist-alerts/${alertId}/toggle`
  );

  return response.data;
};

export const deleteAlert = async (
  alertId
) => {
  await API.delete(
    `/wishlist-alerts/${alertId}`
  );
};