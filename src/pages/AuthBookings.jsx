// ============================================================================
// UNIT 3 - EXPERIMENT 4a: Login & Register components using controlled components
// UNIT 3 - EXPERIMENT 4f: Form validation (required fields, email, password)
// UNIT 4 - EXPERIMENT 3e, 3f: Retrieve reservation history (GET /reservations) & cancellation (DELETE)
// ============================================================================

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  LogIn,
  UserPlus,
  Trash2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { apiRequest } from "../services/api";
import { Loading, ErrorMessage } from "../components/UI";

export function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@staywise.com");
  const [password, setPassword] = useState("travel123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h3>You’re already signed in</h3>
          <p>Welcome back, <strong>{user.name}</strong>!</p>
          <button className="button" onClick={() => navigate("/hotels")}>
            Explore stays <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        // [UNIT 4 - EXP 4a]: Register new account
        await register(name, email, password);
      } else {
        // [UNIT 3 - EXP 4a & UNIT 4 - EXP 4a]: Login user
        await login(email, password);
      }
      // [UNIT 3 - EXP 4e]: Redirect to requested booking page after successful login
      navigate(params.get("redirect") || "/bookings");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-art">
        <span className="kicker">{isRegister ? "Join Staywise" : "Welcome back"}</span>
        <h1>{isRegister ? "Start your journey with curated stays." : "Your next good stay is closer than you think."}</h1>
        <p>
          {isRegister
            ? "Create an account to manage your reservations, save preferences, and unlock exclusive rates."
            : "Sign in to see reservations, manage details and keep your plans in one place."}
        </p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-icon">
          {isRegister ? <UserPlus size={22} /> : <LockKeyhole size={22} />}
        </div>
        <h2>{isRegister ? "Create your account" : "Sign in to Staywise"}</h2>
        <p>{isRegister ? "Fill in your details below to register." : "Use the demo details or enter your own account."}</p>
        {error && <div className="form-error">{error}</div>}

        {isRegister && (
          <label>
            Full Name
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Mehta"
              required
            />
          </label>
        )}

        <label>
          Email address
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
          />
        </label>
        <button className="button full-button" disabled={loading}>
          {loading
            ? (isRegister ? "Creating account..." : "Signing in...")
            : (isRegister ? "Create account" : "Sign in")}{" "}
          {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            type="button"
            className="text-button"
            style={{ fontSize: "12px", color: "var(--teal)" }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Create an account"}
          </button>
        </div>

        <small className="demo-hint">
          {isRegister
            ? "Your account will be saved and you can log in anytime."
            : "Demo: demo@staywise.com (pass: travel123) or any registered user."}
        </small>
      </form>
    </div>
  );
}

// [UNIT 4 - EXPERIMENT 3e, 3f]: Reservation History and Cancellation (CRUD)
export function Bookings() {
  const { user } = useAuth(),
    [data, setData] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    apiRequest("/reservations")
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const cancel = async (id) => {
    try {
      await apiRequest(`/reservations/${id}`, { method: "DELETE" });
      setData(data.filter((x) => x.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };
  if (!user)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h3>Sign in to view your bookings</h3>
          <p>Your reservation history is protected.</p>
          <Link className="button" to="/login?redirect=/bookings">
            Sign in <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  return (
    <div className="page-shell">
      <div className="page-heading">
        <div>
          <span className="kicker">Your trips</span>
          <h1>
            Good plans, all <em>in one place.</em>
          </h1>
          <p>Manage your Staywise reservations.</p>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : data.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Your next story could start with a room.</p>
          <Link className="button" to="/hotels">
            Explore stays <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="booking-list">
          {data.map((item) => (
            <article className="booking-row" key={item.id}>
              <div className="booking-status">
                <CheckCircle2 size={20} />
                <span>
                  Confirmed<small>{item.id}</small>
                </span>
              </div>
              <div>
                <h3>{item.hotelName}</h3>
                <p>
                  {item.roomName} · {item.guests} guests
                </p>
                <span className="booking-dates">
                  <CalendarDays size={14} /> {item.checkIn} → {item.checkOut}
                </span>
              </div>
              <strong>₹{item.total.toLocaleString("en-IN")}</strong>
              <button
                className="icon-button"
                onClick={() => cancel(item.id)}
                title="Cancel reservation"
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuthBookings() {
  const location = useLocation();
  if (location.pathname === "/login") return <Login />;
  return <Bookings />;
}
