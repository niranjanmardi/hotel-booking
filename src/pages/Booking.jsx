import {useMemo,useState} from 'react';import {Link,useLocation,useNavigate} from 'react-router-dom';import {useDispatch,useSelector} from 'react-redux';import {ArrowLeft,ArrowRight,CalendarDays,Check,CreditCard,UserRound} from 'lucide-react';import {clearBooking,selectTotals,updateDates,updateGuest,updateGuests,updatePayment} from '../store/store';import {Stepper} from '../components/UI';import {apiRequest} from '../services/api';import {useAuth} from '../context/AuthContext'
export function BookingGuest(){
  const dispatch=useDispatch(),navigate=useNavigate(),b=useSelector(s=>s.booking);
  if(!b.hotel||!b.room)return <RedirectCard/>;
  const [form,setForm]=useState({...b.guest}),[error,setError]=useState('');
  const submit=e=>{
    e.preventDefault();
    if(!form.name||!/^\S+@\S+\.\S+$/.test(form.email)||form.phone.replace(/\D/g,'').length<10)
      return setError('Please enter a name, valid email and 10-digit phone number.');
    dispatch(updateGuest(form));
    navigate('/booking/summary');
  };
  const handleCheckInChange=val=>{
    let nextCheckOut=b.checkOut;
    if(new Date(val)>=new Date(b.checkOut)){
      const d=new Date(val);
      d.setDate(d.getDate()+1);
      nextCheckOut=d.toISOString().slice(0,10);
    }
    dispatch(updateDates({checkIn:val,checkOut:nextCheckOut}));
  };
  return <BookingFrame step={2}>
    <h1>Tell us who’s <em>checking in.</em></h1>
    <p className="lead">We’ll use these details for your confirmation and arrival information.</p>
    <form className="form-card" onSubmit={submit}>
      {error&&<div className="form-error">{error}</div>}
      <label>Full name<input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Aarav Mehta" required/></label>
      <label>Email address<input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required/></label>
      <label>Phone number<input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" required/></label>
      <div className="date-row">
        <label>Check-in<input className="input" type="date" min={new Date().toISOString().slice(0,10)} value={b.checkIn} onChange={e=>handleCheckInChange(e.target.value)}/></label>
        <label>Check-out<input className="input" type="date" min={b.checkIn} value={b.checkOut} onChange={e=>dispatch(updateDates({checkIn:b.checkIn,checkOut:e.target.value}))}/></label>
      </div>
      <label>Guests<select className="input" value={b.guests} onChange={e=>dispatch(updateGuests(Number(e.target.value)))}>{[1,2,3,4].map(n=><option key={n}>{n}</option>)}</select></label>
      <button className="button full-button" type="submit">Review booking <ArrowRight size={17}/></button>
    </form>
  </BookingFrame>;
}
export function BookingSummary(){
  const navigate=useNavigate(),b=useSelector(s=>s.booking),totals=useSelector(selectTotals);
  if(!b.hotel||!b.room)return <RedirectCard/>;
  return <BookingFrame step={3}>
    <h1>Everything look <em>right?</em></h1>
    <p className="lead">A quick final look before you head to secure checkout.</p>
    <div className="summary-card">
      <div className="summary-hotel">
        <img src={b.hotel.image} alt={b.hotel.name}/>
        <div>
          <span className="kicker">{b.hotel.location}</span>
          <h3>{b.hotel.name}</h3>
          <p>{b.room.name} · {b.guests} guests</p>
        </div>
      </div>
      <div className="summary-lines">
        <div><span><CalendarDays size={16}/> Stay</span><strong>{b.checkIn} → {b.checkOut}<small>{totals.nights} nights</small></strong></div>
        <div><span><UserRound size={16}/> Guest</span><strong>{b.guest.name}<small>{b.guest.email}</small></strong></div>
        <div><span><CreditCard size={16}/> Room rate</span><strong>₹{b.room.price.toLocaleString('en-IN')} / night</strong></div>
      </div>
      <div className="total-row"><span>Total before payment</span><strong>₹{totals.total.toLocaleString('en-IN')}</strong></div>
    </div>
    <div className="actions-row">
      <button className="button button-ghost" onClick={()=>navigate('/booking/guest')}><ArrowLeft size={16}/> Edit details</button>
      <button className="button" onClick={()=>navigate('/checkout')}>Continue to payment <ArrowRight size={17}/></button>
    </div>
  </BookingFrame>;
}
export function Checkout(){
  const dispatch=useDispatch(),navigate=useNavigate(),b=useSelector(s=>s.booking),totals=useSelector(selectTotals),{user}=useAuth(),[method,setMethod]=useState(b.payment),[loading,setLoading]=useState(false),[error,setError]=useState('');
  if(!b.hotel||!b.room)return <RedirectCard/>;
  const pay=async()=>{
    if(!user)return navigate('/login?redirect=/checkout');
    setLoading(true);
    try{
      const r=await apiRequest('/reservations',{method:'POST',body:{hotelId:b.hotel.id,hotelName:b.hotel.name,roomName:b.room.name,checkIn:b.checkIn,checkOut:b.checkOut,guests:b.guests,guest:b.guest,total:totals.total,payment:method}});
      dispatch(clearBooking());
      navigate(`/bookings?new=${r.data.id}`);
    }catch(e){
      setError(e.message);
    }finally{
      setLoading(false);
    }
  };
  return <BookingFrame step={4}>
    <h1>Make it official, <em>securely.</em></h1>
    <p className="lead">This demo simulates a protected payment step. No real charge is made.</p>
    <div className="checkout-grid">
      <div className="payment-card">
        <h3>Payment method</h3>
        {error&&<div className="form-error">{error}</div>}
        <label className="radio-row"><input type="radio" checked={method==='card'} onChange={()=>{setMethod('card');}}/> <CreditCard size={18}/> Credit / debit card <span className="radio-note">Demo</span></label>
        <label className="radio-row"><input type="radio" checked={method==='upi'} onChange={()=>setMethod('upi')}/> <span className="upi-icon">UPI</span> UPI <span className="radio-note">Demo</span></label>
        <div className="secure-note"><Check size={17}/> Protected with token-based authorization</div>
        <button className="button full-button" onClick={pay} disabled={loading}>{loading?'Confirming...':'Confirm reservation'} <ArrowRight size={17}/></button>
      </div>
      <div className="price-card">
        <span className="kicker">Your stay</span>
        <h3>{b.hotel.name}</h3>
        <p>{b.room.name} · {totals.nights} nights</p>
        <div className="price-lines">
          <span>Room cost <b>₹{totals.roomCost.toLocaleString('en-IN')}</b></span>
          <span>Taxes (12%) <b>₹{totals.taxes.toLocaleString('en-IN')}</b></span>
          <span>Service fee <b>₹{totals.serviceFee.toLocaleString('en-IN')}</b></span>
        </div>
        <div className="price-total"><span>Total</span><strong>₹{totals.total.toLocaleString('en-IN')}</strong></div>
      </div>
    </div>
  </BookingFrame>;
}
function BookingFrame({step,children}){return <div className="booking-shell"><Stepper step={step}/><div className="booking-content">{children}</div></div>}
function RedirectCard(){return <div className="page-shell"><div className="empty-state"><h3>Your booking is empty</h3><p>Select a hotel and room to begin.</p><Link to="/hotels" className="button">Explore stays <ArrowRight size={16}/></Link></div></div>}
export default function BookingPage(){
  const location=useLocation();
  if(location.pathname==='/booking/summary') return <BookingSummary/>;
  if(location.pathname==='/checkout') return <Checkout/>;
  return <BookingGuest/>;
}
