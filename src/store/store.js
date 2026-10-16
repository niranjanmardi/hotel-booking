import {configureStore,createSlice} from '@reduxjs/toolkit'
const getSaved=()=>{try{return JSON.parse(localStorage.getItem('staywise-booking')||'null')}catch{return null}}
const saved=getSaved()
const defaultBooking={hotel:null,room:null,checkIn:'2026-11-12',checkOut:'2026-11-15',guests:2,guest:{name:'',email:'',phone:''},payment:'card'}
const initial={hotel:saved?.hotel||null,room:saved?.room||null,checkIn:saved?.checkIn||defaultBooking.checkIn,checkOut:saved?.checkOut||defaultBooking.checkOut,guests:saved?.guests||defaultBooking.guests,guest:saved?.guest||{...defaultBooking.guest},payment:saved?.payment||defaultBooking.payment}
const bookingSlice=createSlice({name:'booking',initialState:initial,reducers:{selectHotel:(s,a)=>{s.hotel=a.payload;s.room=null},selectRoom:(s,a)=>{s.room=a.payload},updateDates:(s,a)=>{s.checkIn=a.payload.checkIn;s.checkOut=a.payload.checkOut},updateGuests:(s,a)=>{s.guests=a.payload},updateGuest:(s,a)=>{s.guest={...s.guest,...a.payload}},updatePayment:(s,a)=>{s.payment=a.payload},clearBooking:()=>({ ...defaultBooking, guest:{...defaultBooking.guest} })}})
export const {selectHotel,selectRoom,updateDates,updateGuests,updateGuest,updatePayment,clearBooking}=bookingSlice.actions
export const store=configureStore({reducer:{booking:bookingSlice.reducer},middleware:getDefault=>getDefault().concat(storeAPI=>next=>action=>{const result=next(action); try{localStorage.setItem('staywise-booking',JSON.stringify(storeAPI.getState().booking))}catch{} return result})})
export const getNights=(a,b)=>{const diff=Math.ceil((new Date(b)-new Date(a))/86400000); return Number.isFinite(diff)&&diff>0?diff:1}
export const selectTotals=s=>{const b=s?.booking||{},nights=getNights(b.checkIn,b.checkOut),roomCost=(b.room?.price||0)*nights,taxes=Math.round(roomCost*.12),serviceFee=roomCost?499:0;return {nights,roomCost,taxes,serviceFee,total:roomCost+taxes+serviceFee}}
