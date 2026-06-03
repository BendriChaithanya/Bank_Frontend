import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const [form, setForm] = useState({
        email: "",
        newPassword: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (form.newPassword !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/api/auth/reset-password", {
                email: form.email.trim(),
                newPassword: form.newPassword
            });

            setMessage(res.data.message || "Password reset successfully");

            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
            console.log("Reset password error:", err.response?.data || err.message);

            const backendMessage =
                err.response?.data?.message ||
                "Password reset failed. Check your email.";

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
                    minHeight: "700px",
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

                    <h2 className="fw-bold mb-1">Reset Password</h2>
                    <p className="mb-0 opacity-75">
                        Set a new password for your account
                    </p>
                </div>

                <form className="p-4 p-sm-5" onSubmit={handleSubmit}>
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
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control form-control-lg rounded-4"
                            placeholder="Enter your registered email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-control form-control-lg rounded-4"
                            placeholder="Enter new password"
                            value={form.newPassword}
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
                            placeholder="Confirm new password"
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
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-link w-100 mt-3 text-decoration-none"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;