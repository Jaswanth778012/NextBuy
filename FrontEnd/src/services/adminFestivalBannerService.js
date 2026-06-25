import API from "./API";

/* ==========================================
   GET ALL FESTIVAL BANNERS
========================================== */

export const getAllFestivalBanners = () => {
  return API.get(
    "/festival-banner/getAll"
  );
};

/* ==========================================
   GET ACTIVE FESTIVAL BANNERS
========================================== */

export const getActiveFestivalBanners = () => {
  return API.get(
    "/festival-banner/getActive"
  );
};

/* ==========================================
   GET BANNER BY ID
========================================== */

export const getFestivalBannerById = (
  id
) => {
  return API.get(
    `/festival-banner/getBannerById/${id}`
  );
};

/* ==========================================
   CREATE BANNER
========================================== */

export const createFestivalBanner = (
  banner,
  image
) => {

  const formData =
    new FormData();

  formData.append(
    "fs",
    new Blob(
      [JSON.stringify(banner)],
      {
        type:
          "application/json",
      }
    )
  );

  formData.append(
    "image",
    image
  );

  return API.post(
    "/festival-banner/create",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

/* ==========================================
   UPDATE BANNER
========================================== */

export const updateFestivalBanner = (
  id,
  banner,
  image
) => {

  const formData =
    new FormData();

  formData.append(
    "fs",
    new Blob(
      [JSON.stringify(banner)],
      {
        type:
          "application/json",
      }
    )
  );

  if (image) {

    formData.append(
      "image",
      image
    );
  }

  return API.put(
    `/festival-banner/updateBanner/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

/* ==========================================
   DELETE BANNER
========================================== */

export const deleteFestivalBanner = (
  id
) => {
  return API.delete(
    `/festival-banner/delete/${id}`
  );
};

/* ==========================================
   GET FESTIVAL PRODUCTS
========================================== */

export const getFestivalProducts = (id) => {
  return API.get(
    `/festival-banner/festivalProducts/${id}`
  );
};

/* ==========================================
   GET RELATED FESTIVAL PRODUCTS
========================================== */

export const getRelatedFestivalProducts = (
  bannerId
) => {
  return API.get(
    `/festival-banner/relatedProducts/${bannerId}`
  );
};