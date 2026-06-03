import "bootstrap/dist/css/bootstrap.min.css";

import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/api/auth/login", {
                email: email.trim(),
                password: password.trim()
            });

            localStorage.clear();
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("role", res.data.role);

            navigate("/dashboard");
        } catch (err) {
            console.log("Login error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <div className="row g-0 min-vh-100">
               <div className="col-lg-7 d-none d-lg-block position-relative p-0">
    <div
        className="w-100 overflow-hidden"
        style={{
            height: "100vh"
        }}
    >
        <img
            src="https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1400&q=80"
            alt="Bank building"
            className="w-100 h-100"
            style={{
                objectFit: "cover",
                objectPosition: "center top"
            }}
        />
    </div>

                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background:
                                "linear-gradient(120deg, rgba(13, 110, 253, 0.85), rgba(33, 37, 41, 0.45))"
                        }}
                    ></div>

                    <div className="position-absolute top-50 start-50 translate-middle text-white w-75">
                        <h1 className="display-4 fw-bold mb-3">
                            Bank Management
                        </h1>
                        <p className="fs-5 mb-4">
                            Securely manage users, accounts, transfers, and transactions from one modern banking dashboard.
                        </p>

                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="bg-white bg-opacity-25 rounded-4 p-3">
                                    <h5 className="fw-bold mb-1">Secure</h5>
                                    <small>Protected account access</small>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="bg-white bg-opacity-25 rounded-4 p-3">
                                    <h5 className="fw-bold mb-1">Fast</h5>
                                    <small>Quick transfers</small>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="bg-white bg-opacity-25 rounded-4 p-3">
                                    <h5 className="fw-bold mb-1">Simple</h5>
                                    <small>Clean banking UI</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-3 p-md-5">
                    <div
                        className="card border-0 shadow-lg rounded-4 w-100 overflow-hidden"
                        style={{
                            maxWidth: "460px"
                        }}
                    >
                        <div className="d-lg-none">
                            <img
                                src="https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=900&q=80"
                                alt="Bank building"
                                className="w-100"
                                style={{
                                    height: "180px",
                                    objectFit: "cover"
                                }}
                            />
                        </div>

                        <div className="card-body p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <div
                                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "72px",
                                        height: "72px",
                                        fontSize: "32px",
                                        fontWeight: "700"
                                    }}
                                >
                                    B
                                </div>

                                <h2 className="fw-bold mb-1">
                                    Welcome Back
                                </h2>
                                <p className="text-muted mb-0">
                                    Login to access your banking dashboard
                                </p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg rounded-4"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg rounded-4"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="rememberMe"
                                        />
                                        <label
                                            className="form-check-label text-muted"
                                            htmlFor="rememberMe"
                                        >
                                            Remember me
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-decoration-none"
                                        onClick={() => navigate("/forgot-password")}
                                    >
                                        Forgot?
                                    </button>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg w-100 fw-semibold rounded-4"
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        height: "56px"
                                    }}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>

                                <p className="text-center text-muted mt-4 mb-0">
                                    Don&apos;t have an account?{" "}
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-decoration-none fw-semibold"
                                        onClick={() => navigate("/signup")}
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;