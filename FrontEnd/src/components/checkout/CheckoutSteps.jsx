import React from "react";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheck,
} from "react-icons/fa";

import "../../styles/CheckoutSteps.css";

function CheckoutSteps({ currentStep }) {
  const steps = [
    {
      id: 1,
      title: "My Cart",
      subtitle: "Review items",
      icon: <FaShoppingCart />,
    },
    {
      id: 2,
      title: "Address",
      subtitle: "Delivery details",
      icon: <FaMapMarkerAlt />,
    },
    {
      id: 3,
      title: "Billing",
      subtitle: "Payment summary",
      icon: <FaCreditCard />,
    },
  ];

  return (
    <div className="checkout-steps-wrapper">
      <div className="checkout-steps-card">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`checkout-step-item ${
                  isActive ? "active" : ""
                } ${isCompleted ? "completed" : ""}`}
              >
                <div className="step-circle">
                  {isCompleted ? <FaCheck /> : step.icon}
                </div>

                <div className="step-content">
                  <span className="step-count">Step {step.id}</span>
                  <h4>{step.title}</h4>
                  <p>{step.subtitle}</p>
                </div>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`step-line ${
                    currentStep > step.id ? "completed" : ""
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default CheckoutSteps;