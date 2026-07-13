import React, {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "react-toastify";

import {
  updateAddress,
} from "../../services/addressService";

function EditAddressForm({
  showModal,
  setShowModal,
  address,
  fetchAddresses,
}) {

  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({
      fullName: "",
      mobileNumber: "",
      pincode: "",
      houseNo: "",
      area: "",
      landmark: "",
      city: "",
      state: "",
      addressType: "HOME",
    });

  useEffect(() => {

    if (address) {

      setFormData({
        fullName:
          address.fullName || "",

        mobileNumber:
          address.mobileNumber || "",

        pincode:
          address.pincode || "",

        houseNo:
          address.houseNo || "",

        area:
          address.area || "",

        landmark:
          address.landmark || "",

        city:
          address.city || "",

        state:
          address.state || "",

        addressType:
          address.addressType ||
          "HOME",
      });
    }

  }, [address]);

  if (!showModal || !address)
    return null;

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const response =
      await updateAddress(
        address.id,
        formData
      );

    if (response?.status === 200) {

      toast.success(
        "Address Updated Successfully"
      );

      // Refresh address list safely
      if (
        typeof fetchAddresses ===
        "function"
      ) {
        fetchAddresses();
      }

      setShowModal(false);
    }

  } catch (error) {

    console.error(
      "Update Error:",
      error
    );

    toast.error(
      "Failed To Update Address"
    );
  } finally {

    setLoading(false);
  }
};


  return (

    <div className="address-modal">

      <div className="address-modal-content">

        <button
          className="close-btn"
          onClick={() =>
            setShowModal(
              false
            )
          }
        >
          ✕
        </button>

        <h2>
          Edit Address
        </h2>

        <form
          className="address-form"
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={
              formData.fullName
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={
              formData.mobileNumber
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={
              formData.pincode
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="houseNo"
            placeholder="House No"
            value={
              formData.houseNo
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="area"
            placeholder="Area"
            value={
              formData.area
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={
              formData.landmark
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={
              formData.city
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={
              formData.state
            }
            onChange={
              handleChange
            }
            required
          />

          <select
            name="addressType"
            value={
              formData.addressType
            }
            onChange={
              handleChange
            }
          >
            <option value="HOME">
              HOME
            </option>

            <option value="WORK">
              WORK
            </option>

            <option value="OTHER">
              OTHER
            </option>
          </select>

          <button
            type="submit"
          >
            {loading
              ? "Updating..."
              : "Update Address"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditAddressForm;