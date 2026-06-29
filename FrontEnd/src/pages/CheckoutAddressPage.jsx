import React, {
  useEffect,
  useState,
} from "react";
// remove this
import {
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  MdVerified,
} from "react-icons/md";


import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import AddressForm from "../components/address/AddressForm";
import AddressList from "../components/address/AddressList";

import {
  getAddresses,
  getDefaultAddress,
  setDefaultAddress,
} from "../services/addressService";

import "../styles/CheckoutAddressPage.css";

function CheckoutAddressPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [showAddAddress,
    setShowAddAddress] =
    useState(false);

  const [addresses,
    setAddresses] =
    useState([]);
 
    const [defaultAddress,
  setDefaultAddressState] =
  useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const subtotal =
    state?.subtotal || 0;

  const deliveryCharge =
    state?.deliveryCharge || 0;

  const grandTotal =
    state?.grandTotal || 0;

  const itemCount =
    state?.cartItems?.length || 0;

  const fetchAddresses = async () => {

    try {

      setLoading(true);

      const response =
        await getAddresses();

      setAddresses(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Fetch Address Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };
  const fetchDefaultAddress = async () => {
  try {
    const response = await getDefaultAddress();

    const data = response?.data;

    // ✅ SAFE CHECK
    if (data && Object.keys(data).length > 0) {
      setDefaultAddressState(data);
    } else {
      setDefaultAddressState(null);
    }

  } catch (error) {
    console.error("Default Address Error:", error);
    setDefaultAddressState(null);
  }
};

  useEffect(() => {

    fetchAddresses();
fetchDefaultAddress();
  }, []);
const handleAddressSelect =
  async (address) => {

    try {

      await setDefaultAddress(
        address.id
      );

      setDefaultAddressState(
        address
      );

    } catch (error) {

      console.error(
        "Set Default Error:",
        error
      );
    }
};
  return (

    <div className="checkout-address-page">

      {/* LEFT SECTION */}

      <div className="address-section">

       <div className="checkout-step-box">

  <div className="hero-content">

    <div className="hero-text">

      <span className="step-badge">
        Step 2 of 4
      </span>

      <h2>
        Delivery Address
      </h2>

      <p>
        Choose where you'd like your order delivered.
        Add a new address or select an existing one
        to continue.
      </p>

    </div>

    <div className="hero-illustration">

      <div className="cloud cloud1"></div>

      <div className="cloud cloud2"></div>

      <div className="map-grid"></div>

      <div className="location-pin">
        <FaMapMarkerAlt />
      </div>

    </div>

  </div>

</div>
    {defaultAddress && (

  <div className="default-address-card">

    <div className="default-address-header">

      <div className="delivery-title-wrap">

        <FaMapMarkerAlt />

        <div>

          <span className="delivery-title">
            Deliver To
          </span>

          <h4>
            {defaultAddress.fullName}
          </h4>

        </div>

      </div>

      <span className="default-tag">
         <MdVerified />
        Default Address
      </span>

    </div>

    <div className="default-address-body">

      <p>
        {defaultAddress.houseNo},{" "}
        {defaultAddress.area},{" "}
        {defaultAddress.city},{" "}
        {defaultAddress.state} -{" "}
        {defaultAddress.pincode}
      </p>

      <span className="mobile-number">

        Mobile:
        {" "}
        {defaultAddress.mobileNumber}

      </span>

    </div>

  </div>

)}

        <div className="address-header">

          <h2>
            Select Delivery Address
          </h2>

          <button
            className="add-address-btn"
            onClick={() =>
              setShowAddAddress(
                true
              )
            }
          >
            + Add Address
          </button>

        </div>

        {loading ? (

          <div className="empty-address-box">

            <h3>
              Loading Addresses...
            </h3>

          </div>

        ) : addresses.length === 0 ? (

          <div className="empty-address-box">

            <h3>
              No Addresses Found
            </h3>

            <p>
              Add your first delivery address.
            </p>

          </div>

        ) : (

          <AddressList
  addresses={addresses}
  fetchAddresses={fetchAddresses}
  fetchDefaultAddress={fetchDefaultAddress}   // ADD THIS
  defaultAddress={defaultAddress}             // ADD THIS
  setDefaultAddressState={setDefaultAddressState} // ADD THIS
  onSelectAddress={handleAddressSelect}
/>
        )}

        <div className="delivery-info-box">

          <h3>
            📦 Why Shop With Us?
          </h3>

          <div className="delivery-points">

            <div>
              ✅ Fast & Reliable Delivery
            </div>

            <div>
              ✅ Secure Checkout
            </div>

            <div>
              ✅ Easy Returns & Refunds
            </div>

            <div>
              ✅ Live Order Tracking
            </div>

            <div>
              ✅ 24/7 Customer Support
            </div>

          </div>

        </div>

        <AddressForm
          showModal={showAddAddress}
          setShowModal={setShowAddAddress}
          fetchAddresses={fetchAddresses}
        />

      </div>

      {/* RIGHT SECTION */}

      <div className="summary-section">

        <div className="summary-card">

          <h3>
            Order Summary
          </h3>

          <div className="summary-row">

            <span>
              Items
            </span>

            <span>
              {itemCount}
            </span>

          </div>

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal.toFixed(2)}
            </span>

          </div>

          <div className="summary-row">

            <span>
              Delivery Charge
            </span>

            <span>
              ₹{deliveryCharge.toFixed(2)}
            </span>

          </div>

          <hr />

          <div className="summary-row total">

            <span>
              Total
            </span>

            <span>
              ₹{grandTotal.toFixed(2)}
            </span>

          </div>

          <div className="payment-message">

            <h4>
              🔒 Secure Checkout
            </h4>

            <p>
              Your payment information is encrypted and
              protected using industry-standard security.
            </p>

          </div>

          <div className="next-step-box">

            <h4>
              Next Step: Payment
            </h4>

            <p>
              Select a delivery address and continue to
              choose your preferred payment method.
            </p>

          </div>

          <button
            className="continue-btn"
            
          >
            PROCEED TO PAYMENT
          </button>
          <div className="secure-payment-footer">
  🔒 100% Secure & Safe Payments
</div>

        </div>

      </div>

    </div>

  );
}

export default CheckoutAddressPage;