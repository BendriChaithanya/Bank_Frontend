import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await API.post("/users", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: "USER"
            });

            setMessage("Account created successfully. Redirecting to login...");

            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
    console.log("Signup error full:", err);
    console.log("Signup response:", err.response?.data);

    const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        "Signup failed. Try another email.";

    setError(backendMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background:
                    "linear-gradient(160deg, #0d6efd 0%, #6610f2 55%, #212529 100%)",
                padding: "20px"
            }}
        >
            <div
                className="bg-white shadow-lg"
                style={{
                    width: "100%",
                    maxWidth: "430px",
                    minHeight: "760px",
                    borderRadius: "32px",
                    overflow: "hidden"
                }}
            >
                <div
                    className="text-white text-center d-flex flex-column align-items-center justify-content-center"
                    style={{
                        height: "210px",
                        background:
                            "linear-gradient(135deg, #0d6efd, #6610f2)"
                    }}
                >
                    <div
                        className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{
                            width: "72px",
                            height: "72px",
                            fontSize: "30px",
                            fontWeight: "700"
                        }}
                    >
                        B
                    </div>

                    <h2 className="fw-bold mb-1">Create Account</h2>
                    <p className="mb-0 opacity-75">
                        Register as a bank customer
                    </p>
                </div>

                <form className="p-4 p-sm-5" onSubmit={handleSignup}>
                    {message && (
                        <div className="alert alert-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="form-control form-control-lg rounded-4"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control form-control-lg rounded-4"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control form-control-lg rounded-4"
                            placeholder="Create password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control form-control-lg rounded-4"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="btn btn-primary btn-lg w-100 fw-semibold rounded-4"
                        type="submit"
                        disabled={loading}
                        style={{
                            height: "56px"
                        }}
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                    <p className="text-center text-muted mt-4 mb-0">
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none fw-semibold"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;