// src/pages/CheckoutSuccessPage.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CheckoutSuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // Empty the cart as soon as the page loads
  }, [clearCart]);

  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4 text-success">Thank you for your order!</h2>
      <p>Your payment was successful. 🎉</p>
      <p>We are processing your order and will contact you shortly.</p>
      
      <div className="mt-4">
        <Link to="/" className="btn btn-primary me-2">
          Back to Home
        </Link>
        <Link to="/shop" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
