import { useNavigate } from "react-router-dom";

function AppNavbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <span
                    className="navbar-brand fw-bold"
                    role="button"
                    onClick={() => navigate("/dashboard")}
                >
                    Bank Management
                </span>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#appNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="appNavbar">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/accounts")}
                            >
                                Accounts
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/transfer")}
                            >
                                Transfer
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/transactions")}
                            >
                                Transactions
                            </button>
                        </li>

                        {role === "ADMIN" && (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={() => navigate("/users")}
                                >
                                    Users
                                </button>
                            </li>
                        )}

                        <li className="nav-item">
                            <span className="badge bg-light text-primary">
                                {name || role}
                            </span>
                        </li>

                        <li className="nav-item">
                            <button
                                className="btn btn-light btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default AppNavbar;