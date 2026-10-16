import {BrowserRouter,Routes,Route,Navigate,useLocation,Outlet} from 'react-router-dom';
import {Suspense,lazy,Component} from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import {useAuth} from './context/AuthContext';

const HotelDetail=lazy(()=>import('./pages/HotelDetail'));
const BookingGuest=lazy(()=>import('./pages/Booking').then(m=>({default:m.BookingGuest})));
const BookingSummary=lazy(()=>import('./pages/Booking').then(m=>({default:m.BookingSummary})));
const Checkout=lazy(()=>import('./pages/Booking').then(m=>({default:m.Checkout})));
const Login=lazy(()=>import('./pages/AuthBookings').then(m=>({default:m.Login})));
const Bookings=lazy(()=>import('./pages/AuthBookings').then(m=>({default:m.Bookings})));

function Guard({children}){const {user}=useAuth();const location=useLocation();const target=location.pathname+location.search;return user?children:<Navigate to={`/login?redirect=${encodeURIComponent(target)}`} replace/>}
class ErrorBoundary extends Component{constructor(props){super(props);this.state={error:null}}static getDerivedStateFromError(error){return {error}}render(){return this.state.error?<Boundary error={this.state.error}/>:this.props.children}}
function Boundary({error}){return <div className="page-shell"><div className="error-box" role="alert"><strong>We hit a small bump.</strong><span>{error.message}</span><a href="/" className="button">Back home</a></div></div>}
function LoadingRoute(){return <div className="loading" role="status" aria-live="polite">Loading page...</div>}
function BookingLayout(){return <Outlet/>}

export default function App(){
  return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<LoadingRoute/>}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/hotels" element={<Hotels/>}/>
            <Route path="/hotel/:id" element={<HotelDetail/>}/>
            <Route path="/rooms" element={<Navigate to="/hotels" replace/>}/>
            <Route path="/booking" element={<Guard><BookingLayout/></Guard>}>
              <Route index element={<Navigate to="guest" replace/>}/>
              <Route path="room" element={<Navigate to="/hotels" replace/>}/>
              <Route path="guest" element={<BookingGuest/>}/>
              <Route path="summary" element={<BookingSummary/>}/>
            </Route>
            <Route path="/checkout" element={<Guard><Checkout/></Guard>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/bookings" element={<Guard><Bookings/></Guard>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  </BrowserRouter>;
}
