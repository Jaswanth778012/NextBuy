import API from "./api";

/* =========================================
   ADDRESS
========================================= */

export const getAddresses = () => {
  return API.get(
    "/Address/getAddress"
  );
};

export const getAddressById = (
  addressId
) => {
  return API.get(
    `/Address/getAddress/${addressId}`
  );
};

export const createAddress = (
  payload
) => {
  return API.post(
    "/Address/createAddress",
    payload
  );
};

export const updateAddress = (
  addressId,
  payload
) => {
  return API.put(
    `/Address/UpdateAddress/${addressId}`,
    payload
  );
};

export const deleteAddress = (
  addressId
) => {
  return API.delete(
    `/Address/deleteAddress/${addressId}`
  );
};

export const setDefaultAddress = (
  addressId
) => {
  return API.put(
    `/Address/default/${addressId}`
  );
};

export const getDefaultAddress = () => {
  return API.get(
    "/Address/defaultAddress"
  );
};