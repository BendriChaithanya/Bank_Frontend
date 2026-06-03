import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <span className="navbar-brand fw-bold text-primary">
                        Bank Management
                    </span>

                    <div>
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/signup")}
                        >
                            Open Account
                        </button>
                    </div>
                </div>
            </nav>

            <section
                className="py-5"
                style={{
                    background:
                        "linear-gradient(135deg, #eef5ff 0%, #ffffff 45%, #eaf1ff 100%)"
                }}
            >
                <div className="container py-4">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <span className="badge bg-primary mb-3">
                                Secure Digital Banking
                            </span>

                            <h1 className="display-5 fw-bold mb-3">
                                Banking made simple, secure, and accessible.
                            </h1>

                            <p className="lead text-muted mb-4">
                                Manage users, accounts, transfers, and transactions from one reliable banking platform.
                            </p>


                            <div className="row g-3">
                                <div className="col-sm-4">
                                    <div className="card border-0 shadow-sm rounded-4 h-100">
                                        <div className="card-body">
                                            <h5 className="fw-bold">24/7</h5>
                                            <p className="text-muted mb-0">
                                                Online access
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4">
                                    <div className="card border-0 shadow-sm rounded-4 h-100">
                                        <div className="card-body">
                                            <h5 className="fw-bold">Fast</h5>
                                            <p className="text-muted mb-0">
                                                Transfers
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4">
                                    <div className="card border-0 shadow-sm rounded-4 h-100">
                                        <div className="card-body">
                                            <h5 className="fw-bold">Secure</h5>
                                            <p className="text-muted mb-0">
                                                Account control
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80"
                                    alt="Bank building"
                                    className="w-100"
                                    style={{
                                        height: "500px",
                                        objectFit: "cover",
                                        objectPosition: "center top"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Banking Services</h2>
                    <p className="text-muted">
                        Everything needed for customer and account management.
                    </p>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body">
                                <h5 className="fw-bold">Account Management</h5>
                                <p className="text-muted mb-0">
                                    Admins can create accounts, manage balances, and track customer account details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body">
                                <h5 className="fw-bold">Money Transfers</h5>
                                <p className="text-muted mb-0">
                                    Users can transfer money between accounts and view transaction history.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body">
                                <h5 className="fw-bold">User Control</h5>
                                <p className="text-muted mb-0">
                                    Role-based access keeps admin features separate from customer features.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white border-top border-bottom py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <h5 className="fw-bold">Contact</h5>
                            <p className="text-muted mb-1">
                                Email: support@bankmanagement.com
                            </p>
                            <p className="text-muted mb-0">
                                Phone: +91 98765 43210
                            </p>
                        </div>

                        <div className="col-md-4">
                            <h5 className="fw-bold">Location</h5>
                            <p className="text-muted mb-0">
                                Hyderabad, Telangana, India
                            </p>
                        </div>

                        <div className="col-md-4">
                            <h5 className="fw-bold">Working Hours</h5>
                            <p className="text-muted mb-1">
                                Monday - Saturday
                            </p>
                            <p className="text-muted mb-0">
                                9:00 AM - 6:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-light py-3">
                <div className="container text-center text-muted">
                    © 2026 Bank Management. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default HomePage;