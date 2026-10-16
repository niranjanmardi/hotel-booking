import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  LogIn,
  Trash2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { apiRequest } from "../services/api";
import { Loading, ErrorMessage } from "../components/UI";
export function Login() {
  const { user, login } = useAuth(),
    navigate = useNavigate(),
    params = new URLSearchParams(useLocation().search),
    [email, setEmail] = useState("demo@staywise.com"),
    [password, setPassword] = useState("travel123"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  if (user)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h3>You’re already signed in</h3>
          <button className="button" onClick={() => navigate("/hotels")}>
            Explore stays <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(params.get("redirect") || "/bookings");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-art">
        <span className="kicker">Welcome back</span>
        <h1>Your next good stay is closer than you think.</h1>
        <p>
          Sign in to see reservations, manage details and keep your plans in one
          place.
        </p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-icon">
          <LockKeyhole size={22} />
        </div>
        <h2>Sign in to Staywise</h2>
        <p>Use the demo details or enter your own.</p>
        {error && <div className="form-error">{error}</div>}
        <label>
          Email address
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
          />
        </label>
        <button className="button full-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"} <LogIn size={16} />
        </button>
        <small className="demo-hint">
          Demo: any valid email + password with 6+ characters
        </small>
      </form>
    </div>
  );
}
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
