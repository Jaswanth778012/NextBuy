import React, {
  useState,
} from "react";

import {
  toast,
} from "react-toastify";

import {
  createAddress,
} from "../../services/addressService";

function AddressForm({
  showModal,
  setShowModal,
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

  if (!showModal)
    return null;

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await createAddress(
          formData
        );

        toast.success(
          "Address Added Successfully"
        );

        fetchAddresses();

        setShowModal(
          false
        );

        setFormData({
          fullName: "",
          mobileNumber: "",
          pincode: "",
          houseNo: "",
          area: "",
          landmark: "",
          city: "",
          state: "",
          addressType:
            "HOME",
        });

      } catch (error) {

        toast.error(
          error?.response
            ?.data ||
            "Failed To Add Address"
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
          Add Address
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
              ? "Saving..."
              : "Save Address"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddressForm;