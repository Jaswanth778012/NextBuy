import API from "./api"


// FETCH ORDER STATS
export const getOrderStats = async () => {
  const response = await API.get("/AdminStats/getTotalStats");
  return response.data;
};

// GET ALL ORDERS
export const getAllOrders = async (
  page = 0,
  size = 5
) => {

  const response = await API.get(
    `/adminOrder/getAllOrders?page=${page}&size=${size}`
  );

  return response.data;
};

// SEARCH ORDER BY ID
export const getOrderById = async (id) => {
  const response = await API.get(
    `/adminOrder/getOrderById/${id}`
  );

  return response.data;
};

// SEARCH USER ORDERS
export const getUserOrders = async (
  userId
) => {
  const response = await API.get(
    `/adminOrder/getUserOrders/${userId}`
  );

  return response.data;
};

// SEARCH BY DATE
export const getOrdersByDate = async (
  date
) => {
  const response = await API.get(
    `/adminOrder/getOrdersByDate/${date}`
  );

  return response.data;
};

// SEARCH BY STATUS
export const getOrdersByStatus = async (
  status
) => {
  const response = await API.get(
    `/adminOrder/getOrdersByStatus/${status}`
  );

  return response.data;
};

// SEARCH BY MONTH
export const getOrdersByMonth = async (
  month
) => {
  const response = await API.get(
    `/adminOrder/getOrdersByMonth/${month}`
  );

  return response.data;
};

// SEARCH BY YEAR
export const getOrdersByYear = async (
  year
) => {
  const response = await API.get(
    `/adminOrder/getOrdersByYear/${year}`
  );

  return response.data;
};

// SEARCH BY MONTH & YEAR
export const getOrdersByMonthAndYear =
  async (month, year) => {

    const response = await API.get(
      `/adminOrder/getOrdersByMonthAndYear/${month}/${year}`
    );

    return response.data;
  };

  export const getTotalOrdersCount = async () => {
  const response = await API.get(
    "/adminOrder/countOfAllOrders"
  );
  return response.data;
};

export const updateOrderStatus = async (
  id,
  status
) => {
  const response = await API.patch(
    `/adminOrder/updateOrderStatus/${id}/${status}`
  );

  return response.data;
};

export const downloadInvoice = async (orderId) => {
  const response = await API.get(
    `/adminOrder/orders/${orderId}/invoice/download`,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice_${orderId}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};