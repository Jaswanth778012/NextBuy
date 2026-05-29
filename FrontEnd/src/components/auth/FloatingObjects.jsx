import React from "react";

import bag from "../../assets/bag.png";
import cart from "../../assets/cart.png";
import shoe from "../../assets/shoe.png";
import gift from "../../assets/gift.png";
import headphone from "../../assets/headphone.png";
import perfume from "../../assets/perfume.png";

function FloatingObjects() {

  return (

    <div className="floating-objects">

      <img
        src={bag}
        alt=""
        className="floating-item bag1"
      />

      <img
        src={cart}
        alt=""
        className="floating-item cart"
      />

      <img
        src={shoe}
        alt=""
        className="floating-item shoe"
      />

      <img
        src={gift}
        alt=""
        className="floating-item gift"
      />

      <img
        src={headphone}
        alt=""
        className="floating-item headphone"
      />

      <img
        src={perfume}
        alt=""
        className="floating-item perfume"
      />

    </div>
  );
}

export default FloatingObjects;