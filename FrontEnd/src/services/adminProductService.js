import API from "./API";

/* ==========================================
   VIEW ALL PRODUCTS
========================================== */

export const viewAllProducts = () => {
  return API.get(
    "/Product/viewAllProducts"
  );
};

/* ==========================================
   ADD PRODUCT
========================================== */

export const addProduct = (
  product,
  images
) => {

  const formData =
    new FormData();

  formData.append(
    "product",
    new Blob(
      [JSON.stringify(product)],
      {
        type:
          "application/json",
      }
    )
  );

  if (
    images &&
    images.length > 0
  ) {

    images.forEach(
      (image) => {

        formData.append(
          "image",
          image
        );
      }
    );
  }

  return API.post(
    "/Product/addProduct",
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
   UPDATE PRODUCT
========================================== */

export const updateProduct = (
  id,
  product,
  images
) => {

  const formData =
    new FormData();

  formData.append(
    "product",
    new Blob(
      [JSON.stringify(product)],
      {
        type:
          "application/json",
      }
    )
  );

  if (
  images &&
  images.length > 0
) {

  images.forEach(
    (image) => {

      formData.append(
        "image",
        image
      );
    }
  );
}

  return API.patch(
    `/Product/updateProduct/${id}`,
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
   DELETE PRODUCT
========================================== */

export const deleteProduct = (
  id
) => {

  return API.delete(
    `/Product/deleteProduct/${id}`
  );
};

/* ==========================================
   UPDATE STOCK
========================================== */

export const updateProductStock =
  (id, stock) => {

    return API.patch(
      `/Product/updateProductStockQality/${id}/${stock}`
    );
  };

/* ==========================================
   UPDATE STATUS
========================================== */

export const updateProductStatus =
  (id, status) => {

    return API.patch(
      `/Product/updateProductStatus/${id}/${status}`
    );
  };

/* ==========================================
   UPDATE DISCOUNT
========================================== */

export const updateDiscount =
  (id, discount) => {

    return API.patch(
      `/Product/updateDisCount/${id}/${discount}`
    );
  };