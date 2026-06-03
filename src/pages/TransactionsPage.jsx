import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [accountId, setAccountId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const loadTransactions = async () => {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const url = role === "ADMIN" ? "/transactions" : "/transactions/my";
            const res = await API.get(url);
            setTransactions(res.data);
        } catch (err) {
            console.log("Load transactions error:", err.response?.data || err.message);
            setError("Unable to load transactions");
        } finally {
            setLoading(false);
        }
    };

    const filterByAccount = async () => {
        if (!accountId) {
            alert("Enter account ID");
            return;
        }

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await API.get(`/transactions/account/${accountId}`);
            setTransactions(res.data);
            setMessage(`Showing transactions for account ID ${accountId}`);
        } catch (err) {
            console.log(err);
            setError("Unable to filter transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const totalAmount = transactions.reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
    );

    const depositCount = transactions.filter(
        (transaction) => transaction.type === "DEPOSIT"
    ).length;

    const withdrawCount = transactions.filter(
        (transaction) => transaction.type === "WITHDRAW"
    ).length;

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
                <div
                    className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)"
                    }}
                >
                    <div className="card-body p-4 p-md-5 text-white">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-8">
                                <span className="badge bg-white text-primary mb-3">
                                    {role}
                                </span>

                                <h2 className="fw-bold mb-2">
                                    {role === "ADMIN"
                                        ? "All Transactions"
                                        : "My Transactions"}
                                </h2>

                                <p className="mb-0 opacity-75">
                                    {role === "ADMIN"
                                        ? "Monitor deposits, withdrawals, and transfer activity across accounts."
                                        : "Track your account activity, transfers, and recent banking history."}
                                </p>
                            </div>

                            <div className="col-lg-4 text-lg-end">
                                <p className="mb-1 opacity-75">
                                    Total Transaction Value
                                </p>
                                <h1 className="fw-bold mb-0">
                                    ₹{totalAmount.toLocaleString("en-IN")}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">
                                        Transactions
                                    </p>
                                    <h3 className="fw-bold mb-0">
                                        {loading ? "..." : transactions.length}
                                    </h3>
                                </div>

                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        fontSize: "22px"
                                    }}
                                >
                                    ↔
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">
                                        Deposits
                                    </p>
                                    <h3 className="fw-bold mb-0">
                                        {loading ? "..." : depositCount}
                                    </h3>
                                </div>

                                <div
                                    className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        fontSize: "22px"
                                    }}
                                >
                                    +
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">
                                        Withdrawals
                                    </p>
                                    <h3 className="fw-bold mb-0">
                                        {loading ? "..." : withdrawCount}
                                    </h3>
                                </div>

                                <div
                                    className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        fontSize: "22px"
                                    }}
                                >
                                    -
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {message && <div className="alert alert-info">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {role === "ADMIN" && (
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1">
                                        Filter Transactions
                                    </h5>
                                    <p className="text-muted mb-0">
                                        Search transactions by account ID.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <input
                                        type="number"
                                        className="form-control rounded-4"
                                        placeholder="Enter account ID"
                                        value={accountId}
                                        onChange={(e) =>
                                            setAccountId(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-md-auto">
                                    <button
                                        className="btn btn-primary rounded-4 px-4"
                                        onClick={filterByAccount}
                                    >
                                        Filter
                                    </button>
                                </div>

                                <div className="col-md-auto">
                                    <button
                                        className="btn btn-outline-secondary rounded-4 px-4"
                                        onClick={() => {
                                            setAccountId("");
                                            loadTransactions();
                                        }}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    Transaction List
                                </h5>
                                <p className="text-muted mb-0">
                                    Detailed view of account transaction history.
                                </p>
                            </div>

                            <span className="badge bg-primary mt-3 mt-md-0">
                                {transactions.length} Records
                            </span>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Account</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-muted py-4"
                                            >
                                                Loading transactions...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-muted py-4"
                                            >
                                                No transactions found
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td>
                                                    <span className="badge bg-dark">
                                                        {transaction.id}
                                                    </span>
                                                </td>

                                                <td>
                                                    {transaction.date
                                                        ? new Date(
                                                              transaction.date
                                                          ).toLocaleString()
                                                        : "-"}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            transaction.type === "DEPOSIT"
                                                                ? "bg-success"
                                                                : transaction.type === "WITHDRAW"
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
                                                        transaction.amount || 0
                                                    ).toLocaleString("en-IN")}
                                                </td>

                                                <td className="fw-semibold">
                                                    {transaction.account
                                                        ?.accountNumber ||
                                                        transaction.account
                                                            ?.id ||
                                                        "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {role !== "ADMIN" && (
                            <p className="text-muted mb-0 mt-3">
                                This page shows transactions linked to your accounts.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionsPage;