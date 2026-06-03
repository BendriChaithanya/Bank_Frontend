import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

function UsersPage() {
    const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
   

    const navigate = useNavigate();

   const loadUsers = async () => {
    setError("");
    setLoading(true);

    try {
        const res = await API.get("/users");
        setUsers(res.data);
    } catch (err) {
        console.log("Load users error:", err.response?.data || err.message);
        setError("Unable to load users");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await API.post("/users", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role
            });

            setMessage("User created successfully");

            setForm({
                name: "",
                email: "",
                password: "",
                role: "USER"
            });

            loadUsers();
        } catch (err) {
            console.log("User creation error:", err.response?.data || err.message);

            const backendMessage =
                err.response?.data?.message ||
                "User creation failed. Use a unique email.";

            setError(backendMessage);
        }
    };

    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm("Delete this user?");

        if (!confirmDelete) {
            return;
        }

        try {
            await API.delete(`/users/${id}`);
            setMessage("User deleted successfully");
            loadUsers();
        } catch (err) {
            console.log(err);
            setError("User delete failed. User may have accounts linked.");
        }
    };

    const copyUserId = async (id) => {
        await navigator.clipboard.writeText(String(id));
        setMessage(`User ID ${id} copied`);
    };

    return (
        <div className="min-vh-100 bg-light">
            <AppNavbar />

            <div className="container py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Manage Users</h2>
                        <p className="text-muted mb-0">
                            Create bank customers and assign roles
                        </p>
                    </div>

                    <button
                        className="btn btn-primary mt-3 mt-md-0"
                        onClick={() => navigate("/accounts")}
                    >
                        Create Account
                    </button>
                </div>

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

                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3">Create New User</h5>

                        <form onSubmit={handleCreateUser}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Role</label>
                                    <select
                                        name="role"
                                        className="form-select"
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>

                                <div className="col-md-2 d-flex align-items-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3">User List</h5>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                  {loading ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        Loading users...
                                                    </td>
                                                </tr>
                                            ) : users.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        No users found
                                                    </td>
                                                </tr>
                                            ) :  (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-dark"
                                                        onClick={() => copyUserId(user.id)}
                                                    >
                                                        {user.id}
                                                    </button>
                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            user.role === "ADMIN"
                                                                ? "bg-danger"
                                                                : "bg-primary"
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => navigate("/accounts")}
                                                        >
                                                            Create Account
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-muted mb-0 mt-3">
                            Click a user ID to copy it, then use it while creating an account.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;