import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

function AccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        accountNumber: "",
        accountType: "SAVINGS",
        balance: "",
        status: "ACTIVE",
        userId: ""
    });

    const [amounts, setAmounts] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const totalBalance = accounts.reduce(
        (sum, account) => sum + Number(account.balance || 0),
        0
    );

    const activeAccounts = accounts.filter(
        (account) => account.status === "ACTIVE"
    ).length;

    const loadAccounts = async () => {
        setError("");
        setLoading(true);

        try {
            const url = role === "ADMIN" ? "/accounts" : "/accounts/my";
            const res = await API.get(url);
            setAccounts(res.data);
        } catch (err) {
            console.log("Load accounts error:", err.response?.data || err.message);
            setError("Unable to load accounts");
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        if (role !== "ADMIN") return;

        try {
            const res = await API.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.log("Load users error:", err.response?.data || err.message);
            setError("Unable to load users");
        }
    };

    useEffect(() => {
        loadAccounts();
        loadUsers();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await API.post("/accounts", {
                accountNumber: form.accountNumber.trim(),
                accountType: form.accountType,
                balance: Number(form.balance),
                status: form.status,
                userId: Number(form.userId)
            });

            setMessage("Account created successfully");

            setForm({
                accountNumber: "",
                accountType: "SAVINGS",
                balance: "",
                status: "ACTIVE",
                userId: ""
            });

            loadAccounts();
        } catch (err) {
            console.log("Account creation error:", err.response?.data || err.message);
            setError("Account creation failed. Check customer and account number.");
        }
    };

    const handleAmountChange = (accountId, value) => {
        setAmounts({
            ...amounts,
            [accountId]: value
        });
    };

    const handleDeposit = async (accountId) => {
        const amount = Number(amounts[accountId]);

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        try {
            await API.post(`/accounts/${accountId}/deposit?amount=${amount}`);
            setMessage("Amount deposited successfully");
            setAmounts({ ...amounts, [accountId]: "" });
            loadAccounts();
        } catch (err) {
            console.log(err);
            setError("Deposit failed");
        }
    };

    const handleWithdraw = async (accountId) => {
        const amount = Number(amounts[accountId]);

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        try {
            await API.post(`/accounts/${accountId}/withdraw?amount=${amount}`);
            setMessage("Amount withdrawn successfully");
            setAmounts({ ...amounts, [accountId]: "" });
            loadAccounts();
        } catch (err) {
            console.log(err);
            setError("Withdraw failed");
        }
    };

    const handleDelete = async (accountId) => {
        const confirmDelete = window.confirm("Delete this account?");

        if (!confirmDelete) return;

        try {
            await API.delete(`/accounts/${accountId}`);
            setMessage("Account deleted successfully");
            loadAccounts();
        } catch (err) {
            console.log(err);
            setError("Delete failed");
        }
    };

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
                                        ? "Manage Customer Accounts"
                                        : "My Bank Accounts"}
                                </h2>

                                <p className="mb-0 opacity-75">
                                    {role === "ADMIN"
                                        ? "Create accounts, manage balances, and support customer banking operations."
                                        : "View your accounts, balances, and account status in one place."}
                                </p>
                            </div>

                            <div className="col-lg-4 text-lg-end">
                                <p className="mb-1 opacity-75">
                                    {role === "ADMIN" ? "Total Balance" : "My Balance"}
                                </p>
                                <h1 className="fw-bold mb-0">
                                    ₹{totalBalance.toLocaleString("en-IN")}
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
                                    <p className="text-muted mb-1">Accounts</p>
                                    <h3 className="fw-bold mb-0">
                                        {loading ? "..." : accounts.length}
                                    </h3>
                                </div>
                                <div
                                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "56px", height: "56px", fontSize: "22px" }}
                                >
                                    ₹
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Active Accounts</p>
                                    <h3 className="fw-bold mb-0">
                                        {loading ? "..." : activeAccounts}
                                    </h3>
                                </div>
                                <div
                                    className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "56px", height: "56px", fontSize: "22px" }}
                                >
                                    ✓
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Access Level</p>
                                    <h3 className="fw-bold mb-0">{role}</h3>
                                </div>
                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                                        role === "ADMIN"
                                            ? "bg-danger bg-opacity-10 text-danger"
                                            : "bg-info bg-opacity-10 text-info"
                                    }`}
                                    style={{ width: "56px", height: "56px", fontSize: "22px" }}
                                >
                                    B
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {role === "ADMIN" && (
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1">Create New Account</h5>
                                    <p className="text-muted mb-0">
                                        Select a customer and open a new bank account.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary mt-3 mt-md-0"
                                    onClick={() => navigate("/users")}
                                >
                                    View Users
                                </button>
                            </div>

                            <form onSubmit={handleCreateAccount}>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Account Number</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            className="form-control rounded-4"
                                            value={form.accountNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold">Type</label>
                                        <select
                                            name="accountType"
                                            className="form-select rounded-4"
                                            value={form.accountType}
                                            onChange={handleChange}
                                        >
                                            <option value="SAVINGS">SAVINGS</option>
                                            <option value="CURRENT">CURRENT</option>
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold">Balance</label>
                                        <input
                                            type="number"
                                            name="balance"
                                            className="form-control rounded-4"
                                            value={form.balance}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold">Status</label>
                                        <select
                                            name="status"
                                            className="form-select rounded-4"
                                            value={form.status}
                                            onChange={handleChange}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold">Customer</label>
                                        <select
                                            name="userId"
                                            className="form-select rounded-4"
                                            value={form.userId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select user</option>

                                            {users
                                                .filter((user) => user.role === "USER")
                                                .map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email})
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="col-md-1 d-flex align-items-end">
                                        <button className="btn btn-primary w-100 rounded-4" type="submit">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    {role === "ADMIN" ? "Account List" : "My Account List"}
                                </h5>
                                <p className="text-muted mb-0">
                                    {role === "ADMIN"
                                        ? "View and manage all customer accounts."
                                        : "Your active bank accounts and available balances."}
                                </p>
                            </div>

                            <span className="badge bg-primary mt-3 mt-md-0">
                                {accounts.length} Accounts
                            </span>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        {role === "ADMIN" && <th>ID</th>}
                                        <th>Account No</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Balance</th>

                                        {role === "ADMIN" && (
                                            <>
                                                <th>Amount</th>
                                                <th>Actions</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={role === "ADMIN" ? "7" : "4"}
                                                className="text-center text-muted py-4"
                                            >
                                                Loading accounts...
                                            </td>
                                        </tr>
                                    ) : accounts.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={role === "ADMIN" ? "7" : "4"}
                                                className="text-center text-muted py-4"
                                            >
                                                No accounts found
                                            </td>
                                        </tr>
                                    ) : (
                                        accounts.map((account) => (
                                            <tr key={account.id}>
                                                {role === "ADMIN" && (
                                                    <td>
                                                        <span className="badge bg-dark">
                                                            {account.id}
                                                        </span>
                                                    </td>
                                                )}

                                                <td className="fw-semibold">{account.accountNumber}</td>

                                                <td>
                                                    <span className="badge bg-primary bg-opacity-10 text-primary">
                                                        {account.accountType}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            account.status === "ACTIVE"
                                                                ? "bg-success"
                                                                : account.status === "INACTIVE"
                                                                ? "bg-warning text-dark"
                                                                : "bg-secondary"
                                                        }`}
                                                    >
                                                        {account.status}
                                                    </span>
                                                </td>

                                                <td className="fw-bold">
                                                    ₹{Number(account.balance || 0).toLocaleString("en-IN")}
                                                </td>

                                                {role === "ADMIN" && (
                                                    <>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm rounded-3"
                                                                placeholder="Amount"
                                                                value={amounts[account.id] || ""}
                                                                onChange={(e) =>
                                                                    handleAmountChange(account.id, e.target.value)
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-success"
                                                                    onClick={() => handleDeposit(account.id)}
                                                                >
                                                                    Deposit
                                                                </button>

                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    onClick={() => handleWithdraw(account.id)}
                                                                >
                                                                    Withdraw
                                                                </button>

                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(account.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {role !== "ADMIN" && (
                            <p className="text-muted mb-0 mt-3">
                                Contact the bank admin for account updates or support.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountsPage;