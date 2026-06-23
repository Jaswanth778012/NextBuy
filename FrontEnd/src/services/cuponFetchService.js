const BASE_URL = "http://localhost:9090";

const getToken = () => {
  const token = localStorage.getItem("token");

  if (
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token !== ""
  ) {
    return token;
  }

  return null;
};

export const applyCuponFetch = async (code) => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/Cupon/apply/${encodeURIComponent(
      code.trim().toUpperCase()
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  const message = await response.text();

  if (!response.ok) {
    throw new Error(message || "Unable to apply coupon");
  }

  return message;
};

export const removeCuponFetch = async () => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/Cupon/remove`,
    {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  const message = await response.text();

  if (!response.ok) {
    throw new Error(message || "Unable to remove coupon");
  }

  return message;
};

export const getAvailableCuponsForUserFetch = async () => {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}/Cupon/availableforUser`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to fetch coupons");
  }

  return response.json();
};