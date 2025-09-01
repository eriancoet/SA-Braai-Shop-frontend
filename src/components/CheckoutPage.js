import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayFast = async () => {
    try {
      const response = await axios.post("https://sa-braai-shop-backend.onrender.com/api/payfast/pay", {
        amount: total, // numeric only
        item_name: "Biltong Shop Order",
        return_url: "http://localhost:3000/checkout-success",
        cancel_url: "http://localhost:3000/checkout-cancel",
        notify_url: "http://localhost:5000/api/payfast/notify",
      });

      const { paymentUrl } = response.data;
      window.location.href = paymentUrl; // redirect to PayFast
    } catch (err) {
      console.error("PayFast error:", err);
      alert("Failed to initiate PayFast payment.");
    }
  };

  const handlePayPal = () => {
    alert("PayPal integration not set up yet.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", form, cart, total);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>
      <div className="row">
        {/* Customer Details Form */}
        <div className="col-md-6 mb-4">
          <form onSubmit={handleSubmit}>
            {["fullName","email","phone","address","city","postalCode"].map((field) => (
              <div key={field} className="mb-3">
                <label className="form-label">{field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  className="form-control"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-md-6">
          <h4>Order Summary</h4>
          <ul className="list-group mb-3">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.name} x {item.qty}</span>
                <span>R{(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </li>
          </ul>

          {/* Payment Buttons */}
          <button className="btn btn-primary w-100 mb-2" onClick={handlePayFast}>
            Pay with PayFast
          </button>
          <button className="btn btn-secondary w-100" onClick={handlePayPal}>
            Pay with PayPal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
