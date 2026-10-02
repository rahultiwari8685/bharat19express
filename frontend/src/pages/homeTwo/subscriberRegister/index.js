import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://api.iotaclasses.in";

const SubscriberRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/api/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Save login information
      localStorage.setItem(
        "logininfo",
        JSON.stringify({
          token: data.token,
          customer: data.customer,
        }),
      );

      // Redirect after registration
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .subscriber-register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 15px;
          background:
            radial-gradient(
              circle at top left,
              rgba(255, 193, 7, 0.18),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #fff8e1 0%,
              #ffffff 45%,
              #fff3cd 100%
            );
        }

        .subscriber-register-card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border-radius: 22px;
          padding: 38px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .register-logo {
          width: 58px;
          height: 58px;
          margin: 0 auto 18px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffc107;
          color: #111;
          font-size: 27px;
          font-weight: 800;
        }

        .register-title {
          text-align: center;
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 8px;
          color: #171717;
        }

        .register-subtitle {
          text-align: center;
          color: #777;
          margin-bottom: 28px;
        }

        .register-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .register-input {
          width: 100%;
          height: 50px;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 0 15px;
          font-size: 15px;
          outline: none;
          transition: 0.2s;
          margin-bottom: 18px;
        }

        .register-input:focus {
          border-color: #ffc107;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.12);
        }

        .register-error {
          background: #fff0f0;
          border: 1px solid #ffcaca;
          color: #c62828;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 18px;
        }

        .register-button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 12px;
          background: #ffc107;
          color: #111;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .register-button:hover {
          background: #ffb300;
          transform: translateY(-1px);
        }

        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .register-login {
          text-align: center;
          margin-top: 22px;
          color: #777;
          font-size: 14px;
        }

        .register-login a {
          color: #111;
          font-weight: 700;
          text-decoration: none;
        }

        .register-login a:hover {
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .subscriber-register-card {
            padding: 28px 20px;
            border-radius: 18px;
          }

          .register-title {
            font-size: 26px;
          }
        }
      `}</style>

      <div className="subscriber-register-page">
        <div className="subscriber-register-card">
          <div className="register-logo">IT</div>

          <h1 className="register-title">Create Account</h1>

          <p className="register-subtitle">
            Register to participate in polls and more.
          </p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="register-label">Full Name</label>

            <input
              type="text"
              name="name"
              className="register-input"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

            <label className="register-label">Email Address</label>

            <input
              type="email"
              name="email"
              className="register-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="register-label">Phone Number</label>

            <input
              type="tel"
              name="phone"
              className="register-input"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label className="register-label">Password</label>

            <input
              type="password"
              name="password"
              className="register-input"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />

            <label className="register-label">Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              className="register-input"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="register-login">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriberRegister;
