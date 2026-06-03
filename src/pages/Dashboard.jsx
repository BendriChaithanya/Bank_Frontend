import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    const loadDashboard = async () => {
        setLoading(true);
        setError("");

        try {
            const accountsUrl = role === "ADMIN" ? "/accounts" : "/accounts/my";
            const transactionsUrl =
                role === "ADMIN" ? "/transactions" : "/transactions/my";

            const accountsRes = await API.get(accountsUrl);
            const transactionsRes = await API.get(transactionsUrl);

            setAccounts(accountsRes.data);
            setTransactions(transactionsRes.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const totalBalance = accounts.reduce(
        (sum, account) => sum + Number(account.balance || 0),
        0
    );

    const activeAccounts = accounts.filter(
        (account) => account.status === "ACTIVE"
    ).length;

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div
            className="min-vh-100"
            style={{
                background:
                    "linear-gradient(135deg, #eef5ff 0%, #f8f9fa 45%, #e8f0ff 100%)"
            }}
        >
            <AppNavbar />

            <div className="container py-4">
                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                            <div className="row g-0 h-100">
                                <div className="col-md-7">
                                    <div className="card-body p-4 p-md-5">
                                        <span
                                            className={`badge mb-3 ${
                                                role === "ADMIN"
                                                    ? "bg-danger"
                                                    : "bg-primary"
                                            }`}
                                        >
                                            {role}
                                        </span>

                                        <h2 className="fw-bold mb-2">
                                            {role === "ADMIN"
                                                ? "Admin Banking Dashboard"
                                                : "Welcome Back"}
                                        </h2>

                                        <p className="text-muted mb-4">
                                            Hello {name || email}, manage your banking
                                            activities securely from one dashboard.
                                        </p>

                                        <div className="d-flex flex-column flex-sm-row gap-2">
                                            <button
                                                className="btn btn-primary rounded-4 px-4"
                                                onClick={() => navigate("/accounts")}
                                            >
                                                {role === "ADMIN"
                                                    ? "Manage Accounts"
                                                    : "My Accounts"}
                                            </button>

                                            <button
                                                className="btn btn-outline-primary rounded-4 px-4"
                                                onClick={() =>
                                                    navigate("/transactions")
                                                }
                                            >
                                                Transactions
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-5 d-none d-md-block">
                                    <img
                                        src="https://images.unsplash.com/photo-1565373677928-90e963765eac?auto=format&fit=crop&w=900&q=80"
                                        alt="Banking dashboard"
                                        className="w-100 h-100"
                                        style={{
                                            objectFit: "cover",
                                            minHeight: "260px"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div
                            className="card border-0 shadow-sm rounded-4 h-100 text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg, #0d6efd, #6610f2)"
                            }}
                        >
                            <div className="card-body p-4">
                                <p className="mb-2 opacity-75">
                                    {role === "ADMIN"
                                        ? "Total Bank Balance"
                                        : "My Balance"}
                                </p>

                                <h1 className="fw-bold mb-4">
                                    ₹{totalBalance.toLocaleString("en-IN")}
                                </h1>

                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="opacity-75">
                                            Accounts
                                        </small>
                                        <h5 className="fw-bold mb-0">
                                            {loading ? "..." : accounts.length}
                                        </h5>
                                    </div>

                                    <div>
                                        <small className="opacity-75">
                                            Transactions
                                        </small>
                                        <h5 className="fw-bold mb-0">
                                            {loading ? "..." : transactions.length}
                                        </h5>
                                    </div>

                                    <div>
                                        <small className="opacity-75">
                                            Active
                                        </small>
                                        <h5 className="fw-bold mb-0">
                                            {loading ? "..." : activeAccounts}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex align-items-center justify-content-between p-4">
                                <div>
                                    <p className="text-muted mb-1">
                                        {role === "ADMIN"
                                            ? "Total Accounts"
                                            : "My Accounts"}
                                    </p>
                                    <h3 className="fw-bold mb-1">
                                        {loading ? "..." : accounts.length}
                                    </h3>
                                    <small className="text-muted">
                                        {activeAccounts} active accounts
                                    </small>
                                </div>

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "58px",
                                        height: "58px",
                                        fontSize: "24px"
                                    }}
                                >
                                    ₹
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex align-items-center justify-content-between p-4">
                                <div>
                                    <p className="text-muted mb-1">
                                        {role === "ADMIN"
                                            ? "Total Transactions"
                                            : "My Transactions"}
                                    </p>
                                    <h3 className="fw-bold mb-1">
                                        {loading ? "..." : transactions.length}
                                    </h3>
                                    <small className="text-muted">
                                        Recent banking activity
                                    </small>
                                </div>

                                <div
                                    className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "58px",
                                        height: "58px",
                                        fontSize: "24px"
                                    }}
                                >
                                    ↗
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex align-items-center justify-content-between p-4">
                                <div>
                                    <p className="text-muted mb-1">
                                        Access Level
                                    </p>
                                    <h3 className="fw-bold mb-1">{role}</h3>
                                    <small className="text-muted">
                                        Role-based access enabled
                                    </small>
                                </div>

                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                                        role === "ADMIN"
                                            ? "bg-danger bg-opacity-10 text-danger"
                                            : "bg-info bg-opacity-10 text-info"
                                    }`}
                                    style={{
                                        width: "58px",
                                        height: "58px",
                                        fontSize: "24px"
                                    }}
                                >
                                    ✓
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1">
                                            {role === "ADMIN"
                                                ? "Recent Accounts"
                                                : "My Accounts"}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {role === "ADMIN"
                                                ? "Latest customer account records"
                                                : "Your linked bank accounts"}
                                        </p>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-outline-primary rounded-4 mt-3 mt-md-0 px-3"
                                        onClick={() => navigate("/accounts")}
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Account No</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th className="text-end">
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        Loading accounts...
                                                    </td>
                                                </tr>
                                            ) : accounts.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        No accounts found
                                                    </td>
                                                </tr>
                                            ) : (
                                                accounts.slice(0, 5).map((account) => (
                                                    <tr key={account.id}>
                                                        <td className="fw-semibold">
                                                            {account.accountNumber}
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-primary bg-opacity-10 text-primary">
                                                                {account.accountType}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    account.status ===
                                                                    "ACTIVE"
                                                                        ? "bg-success"
                                                                        : "bg-secondary"
                                                                }`}
                                                            >
                                                                {account.status}
                                                            </span>
                                                        </td>
                                                        <td className="text-end fw-bold">
                                                            ₹
                                                            {Number(
                                                                account.balance || 0
                                                            ).toLocaleString("en-IN")}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1">
                                            Recent Transactions
                                        </h5>
                                        <p className="text-muted mb-0">
                                            Latest deposits, withdrawals, and transfers
                                        </p>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-outline-primary rounded-4 mt-3 mt-md-0 px-3"
                                        onClick={() => navigate("/transactions")}
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        Loading transactions...
                                                    </td>
                                                </tr>
                                            ) : recentTransactions.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        No transactions found
                                                    </td>
                                                </tr>
                                            ) : (
                                                recentTransactions.map(
                                                    (transaction) => (
                                                        <tr key={transaction.id}>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        transaction.type ===
                                                                        "DEPOSIT"
                                                                            ? "bg-success"
                                                                            : transaction.type ===
                                                                              "WITHDRAW"
                                                                            ? "bg-warning text-dark"
                                                                            : "bg-primary"
                                                                    }`}
                                                                >
                                                                    {transaction.type}
                                                                </span>
                                                            </td>
                                                            <td className="fw-bold">
                                                                ₹
                                                                {Number(
                                                                    transaction.amount ||
                                                                        0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </td>
                                                            <td>
                                                                {transaction.date
                                                                    ? new Date(
                                                                          transaction.date
                                                                      ).toLocaleString()
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-1">
                                    Quick Actions
                                </h5>
                                <p className="text-muted mb-4">
                                    Common banking actions
                                </p>

                                <div className="d-grid gap-3">
                                    <button
                                        className="btn btn-primary btn-lg rounded-4"
                                        onClick={() => navigate("/accounts")}
                                    >
                                        {role === "ADMIN"
                                            ? "Manage Accounts"
                                            : "My Accounts"}
                                    </button>

                                    <button
                                        className="btn btn-outline-primary btn-lg rounded-4"
                                        onClick={() => navigate("/transfer")}
                                    >
                                        Transfer Money
                                    </button>

                                    <button
                                        className="btn btn-outline-secondary btn-lg rounded-4"
                                        onClick={() =>
                                            navigate("/transactions")
                                        }
                                    >
                                        View Transactions
                                    </button>

                                    {role === "ADMIN" && (
                                        <button
                                            className="btn btn-outline-dark btn-lg rounded-4"
                                            onClick={() => navigate("/users")}
                                        >
                                            Manage Users
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-1">
                                    Profile Summary
                                </h5>
                                <p className="text-muted mb-4">
                                    Current signed-in user
                                </p>

                                <div className="border rounded-4 p-3 mb-3 bg-light">
                                    <p className="text-muted mb-1">Name</p>
                                    <h6 className="fw-bold mb-0">
                                        {name || "Unknown User"}
                                    </h6>
                                </div>

                                <div className="border rounded-4 p-3 mb-3 bg-light">
                                    <p className="text-muted mb-1">Email</p>
                                    <h6 className="fw-bold mb-0">
                                        {email || "No email"}
                                    </h6>
                                </div>

                                <div className="border rounded-4 p-3 bg-light">
                                    <p className="text-muted mb-1">Role</p>
                                    <span
                                        className={`badge ${
                                            role === "ADMIN"
                                                ? "bg-danger"
                                                : "bg-primary"
                                        }`}
                                    >
                                        {role || "USER"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;