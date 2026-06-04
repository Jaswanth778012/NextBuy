import API from "./api";

// ==========================
// ADD BRAND
// ==========================

export const addBrand = async (
  brandData,
  logo
) => {
  const formData = new FormData();

  formData.append(
    "brand",
    new Blob(
      [JSON.stringify(brandData)],
      {
        type: "application/json",
      }
    )
  );

  if (logo) {
    formData.append("logo", logo);
  }

  const response = await API.post(
    "/Brands/addBrand",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================
// UPDATE BRAND
// ==========================

export const updateBrand = async (
  brandId,
  brandData,
  logo
) => {
  const formData = new FormData();

  formData.append(
    "brand",
    new Blob(
      [JSON.stringify(brandData)],
      {
        type: "application/json",
      }
    )
  );

  if (logo) {
    formData.append("logo", logo);
  }

  const response = await API.put(
    `/Brands/updateBrand/${brandId}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================
// GET BRAND BY ID
// ==========================

export const getBrandById = async (
  brandId
) => {
  const response = await API.get(
    `/Brands/brand/${brandId}`
  );

  return response.data;
};

// ==========================
// GET BRAND BY NAME
// ==========================

export const getBrandByName = async (
  name
) => {
  const response = await API.get(
    `/Brands/brandname/${name}`
  );

  return response.data;
};

// ==========================
// GET ALL BRANDS
// ==========================

export const getAllBrands = async () => {
  const response = await API.get(
    "/Brands/brand/all"
  );

  return response.data;
};

// ==========================
// DELETE BRAND
// ==========================

export const deleteBrand = async (
  brandId
) => {
  const response = await API.delete(
    `/Brands/brand/${brandId}`
  );

  return response.data;
};