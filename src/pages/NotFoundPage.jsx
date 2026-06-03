import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
            <div
                className="card border-0 shadow-sm rounded-4 w-100"
                style={{ maxWidth: "480px" }}
            >
                <div className="card-body text-center p-5">
                    <h1 className="fw-bold text-primary display-4 mb-2">
                        404
                    </h1>

                    <h4 className="fw-bold mb-2">
                        Page Not Found
                    </h4>

                    <p className="text-muted mb-4">
                        The page you are looking for does not exist or has been moved.
                    </p>

                    <button
                        className="btn btn-primary rounded-4 px-4"
                        onClick={() =>
                            navigate(token ? "/dashboard" : "/")
                        }
                    >
                        {token ? "Back to Dashboard" : "Back to Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;