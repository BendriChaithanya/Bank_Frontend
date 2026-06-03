import { useEffect, useState } from "react";
import API from "../api/axios";
import AppNavbar from "../components/AppNavbar";

function TransferPage() {
    const [accounts, setAccounts] = useState([]);
    const [receiverAccounts, setReceiverAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transferring, setTransferring] = useState(false);

    const [form, setForm] = useState({
        fromAccountId: "",
        toAccountId: "",
        amount: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");

    const selectedFromAccount = accounts.find(
        (account) => String(account.id) === String(form.fromAccountId)
    );

    const loadAccounts = async () => {
        setLoading(true);
        setError("");

        try {
            const myAccountsUrl = role === "ADMIN" ? "/accounts" : "/accounts/my";

            const myAccountsRes = await API.get(myAccountsUrl);
            const allAccountsRes = await API.get("/accounts");

            setAccounts(myAccountsRes.data);
            setReceiverAccounts(allAccountsRes.data);
        } catch (err) {
            console.log("Load accounts error:", err.response?.data || err.message);
            setError("Unable to load accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const amount = Number(form.amount);

        if (!form.fromAccountId || !form.toAccountId) {
            setError("Please select both sender and receiver accounts");
            return;
        }

        if (form.fromAccountId === form.toAccountId) {
            setError("From account and receiver account cannot be same");
            return;
        }

        if (!amount || amount <= 0) {
            setError("Enter a valid amount");
            return;
        }

        if (selectedFromAccount && amount > Number(selectedFromAccount.balance)) {
            setError("Insufficient balance in selected account");
            return;
        }

        setTransferring(true);

        try {
            const res = await API.post("/accounts/transfer", {
                fromAccountId: Number(form.fromAccountId),
                toAccountId: Number(form.toAccountId),
                amount
            });

            setMessage(res.data || "Transfer completed successfully");

            setForm({
                fromAccountId: "",
                toAccountId: "",
                amount: ""
            });

            loadAccounts();
        } catch (err) {
            console.log("Transfer error:", err.response?.data || err.message);

            const backendMessage =
                err.response?.data?.message ||
                "Transfer failed. Check account details and balance.";

            setError(backendMessage);
        } finally {
            setTransferring(false);
        }
    };

    return (
        <div
            className="min-vh-100"
            style={{
                background:
                    "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 45%, #dcfce7 100%)"
            }}
        >
            <AppNavbar />

            <div className="container py-4">
                <div
                    className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)"
                    }}
                >
                    <div className="card-body p-4 p-md-5 text-white">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-8">
                                <span className="badge bg-white text-primary mb-3">
                                    Secure Transfer
                                </span>

                                <h2 className="fw-bold mb-2">
                                    Transfer Money
                                </h2>

                                <p className="mb-0 opacity-75">
                                    Move money securely between accounts.
                                </p>
                            </div>

                            <div className="col-lg-4 text-lg-end">
                                <p className="mb-1 opacity-75">
                                    Available Accounts
                                </p>
                                <h1 className="fw-bold mb-0">
                                    {loading ? "..." : accounts.length}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-1">
                                    New Transfer
                                </h5>
                                <p className="text-muted mb-4">
                                    Select sender, receiver, and amount.
                                </p>

                                <form onSubmit={handleTransfer}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            From Account
                                        </label>

                                        <select
                                            name="fromAccountId"
                                            className="form-select form-select-lg rounded-4"
                                            value={form.fromAccountId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select account
                                            </option>

                                            {accounts.map((account) => (
                                                <option
                                                    key={account.id}
                                                    value={account.id}
                                                >
                                                    {account.accountNumber} - ₹
                                                    {Number(account.balance || 0).toLocaleString("en-IN")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Receiver Account
                                        </label>

                                        <select
                                            name="toAccountId"
                                            className="form-select form-select-lg rounded-4"
                                            value={form.toAccountId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select receiver account
                                            </option>

                                            {receiverAccounts
                                                .filter(
                                                    (account) =>
                                                        String(account.id) !== String(form.fromAccountId)
                                                )
                                                .map((account) => (
                                                    <option
                                                        key={account.id}
                                                        value={account.id}
                                                    >
                                                        {account.accountNumber} - {account.accountType}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Amount
                                        </label>

                                        <input
                                            type="number"
                                            name="amount"
                                            className="form-control form-control-lg rounded-4"
                                            placeholder="Enter amount"
                                            value={form.amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {selectedFromAccount && (
                                        <div className="alert alert-info rounded-4">
                                            Available balance:{" "}
                                            <strong>
                                                ₹
                                                {Number(
                                                    selectedFromAccount.balance || 0
                                                ).toLocaleString("en-IN")}
                                            </strong>
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-primary btn-lg w-100 rounded-4 fw-semibold"
                                        type="submit"
                                        disabled={loading || transferring}
                                        style={{ height: "56px" }}
                                    >
                                        {transferring ? "Transferring..." : "Transfer Money"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1">
                                            Available Accounts
                                        </h5>
                                        <p className="text-muted mb-0">
                                            Accounts available for transfer.
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
                                                <th>ID</th>
                                                <th>Account No</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th className="text-end">Balance</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        Loading accounts...
                                                    </td>
                                                </tr>
                                            ) : accounts.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        No accounts found
                                                    </td>
                                                </tr>
                                            ) : (
                                                accounts.map((account) => (
                                                    <tr key={account.id}>
                                                        <td>
                                                            <span className="badge bg-dark">
                                                                {account.id}
                                                            </span>
                                                        </td>

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
                                                                    account.status === "ACTIVE"
                                                                        ? "bg-success"
                                                                        : "bg-secondary"
                                                                }`}
                                                            >
                                                                {account.status}
                                                            </span>
                                                        </td>

                                                        <td className="fw-bold text-end">
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

                                <p className="text-muted mb-0">
                                    Choose one of these accounts as the sender account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransferPage;