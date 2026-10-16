import {BrowserRouter,Routes,Route,Navigate,useLocation,Outlet} from 'react-router-dom';
import {Suspense,lazy,Component} from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import {useAuth} from './context/AuthContext';

import {ProtectedRoute,ErrorBoundary} from './components/UI';

const HotelDetail=lazy(()=>import('./pages/HotelDetail'));
const BookingGuest=lazy(()=>import('./pages/Booking').then(m=>({default:m.BookingGuest})));
const BookingSummary=lazy(()=>import('./pages/Booking').then(m=>({default:m.BookingSummary})));
const Checkout=lazy(()=>import('./pages/Booking').then(m=>({default:m.Checkout})));
const Login=lazy(()=>import('./pages/AuthBookings').then(m=>({default:m.Login})));
const Bookings=lazy(()=>import('./pages/AuthBookings').then(m=>({default:m.Bookings})));

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
            <Route path="/booking" element={<ProtectedRoute><BookingLayout/></ProtectedRoute>}>
              <Route index element={<Navigate to="guest" replace/>}/>
              <Route path="room" element={<Navigate to="/hotels" replace/>}/>
              <Route path="guest" element={<BookingGuest/>}/>
              <Route path="summary" element={<BookingSummary/>}/>
            </Route>
            <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path="/payment" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/bookings" element={<ProtectedRoute><Bookings/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  </BrowserRouter>;
}
