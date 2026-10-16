// ============================================================================
// UNIT 4 - EXPERIMENT 1: Develop Hotel Booking Application with REST APIs
// UNIT 4 - EXPERIMENT 3: Implement Hotel Reservation CRUD Operations (GET, POST, PATCH, DELETE)
// UNIT 4 - EXPERIMENT 4: Authentication & Token Management (Bearer Authorization)
// ============================================================================

import {hotels} from '../data/hotels'
const wait=(ms=450)=>new Promise(resolve=>setTimeout(resolve,ms))
const cache=new Map()
const readReservations=()=>{try{return JSON.parse(localStorage.getItem('staywise-reservations')||'[]')}catch{return []}}
const writeReservations=data=>{try{localStorage.setItem('staywise-reservations',JSON.stringify(data))}catch{}}
const getToken=()=>{try{const u=JSON.parse(sessionStorage.getItem('staywise-user')||'null');return u?.token||null}catch{return null}}
export const clearApiCache=()=>cache.clear()

export async function apiRequest(path,{method='GET',body,headers={}}={}){
  const token = headers.Authorization || (getToken() ? `Bearer ${getToken()}` : null)
  const cacheKey=`${method}:${path}`
  if(method==='GET'&&cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    console.log(`%c[REST API: GET (Cached)] ${path}`, 'color: #0f766e; font-weight: bold;', cached);
    return cached;
  }
  await wait()
  let response

  // [CRUD - READ]: GET /hotels (Unit 4 Exp 1 & Exp 3a)
  if(path==='/hotels'&&method==='GET'){
    response={data:hotels}
    console.log('%c[REST API: GET /hotels] (CRUD - Read All Hotels)', 'color: #0f766e; font-weight: bold;', response.data)
  }
  // [CRUD - READ]: GET /hotels/:id (Unit 4 Exp 1d & Exp 3a)
  else if(path.startsWith('/hotels/')&&method==='GET'){
    const id=path.split('/')[2];
    const hotel=hotels.find(item=>item.id===id);
    if(!hotel)throw new Error('Hotel not found');
    response={data:hotel}
    console.log(`%c[REST API: GET /hotels/${id}] (CRUD - Read Hotel Details)`, 'color: #0f766e; font-weight: bold;', response.data)
  }
  // [CRUD - READ]: GET /reservations (Unit 4 Exp 3e)
  else if(path==='/reservations'&&method==='GET'){
    response={data:readReservations()}
    console.log('%c[REST API: GET /reservations] (CRUD - Read Reservations History)', 'color: #0284c7; font-weight: bold;', response.data)
  }
  // [CRUD - CREATE]: POST /reservations (Unit 4 Exp 3b & Exp 4c)
  else if(path==='/reservations'&&method==='POST'){
    const reservation={...body,id:`SW-${Date.now().toString().slice(-6)}`,status:'Confirmed',createdAt:new Date().toISOString(),authToken:token};
    const next=[reservation,...readReservations()];
    writeReservations(next);
    response={data:reservation}
    console.log('%c[REST API: POST /reservations] (CRUD - Create Reservation)', 'color: #16a34a; font-weight: bold; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;', response.data)
  }
  // [CRUD - UPDATE]: PATCH /reservations/:id (Unit 4 Exp 3c)
  else if(path.startsWith('/reservations/')&&method==='PATCH'){
    const id=path.split('/')[2];
    const current=readReservations();
    if(!current.some(item=>item.id===id))throw new Error('Reservation not found');
    const next=current.map(item=>item.id===id?{...item,...body}:item);
    writeReservations(next);
    response={data:next.find(item=>item.id===id)}
    console.log(`%c[REST API: PATCH /reservations/${id}] (CRUD - Update Reservation)`, 'color: #d97706; font-weight: bold; background: #fffbeb; padding: 2px 6px; border-radius: 4px;', response.data)
  }
  // [CRUD - DELETE]: DELETE /reservations/:id (Unit 4 Exp 3d)
  else if(path.startsWith('/reservations/')&&method==='DELETE'){
    const id=path.split('/')[2];
    const next=readReservations().filter(item=>item.id!==id);
    writeReservations(next);
    response={data:{id}}
    console.log(`%c[REST API: DELETE /reservations/${id}] (CRUD - Cancel/Delete Reservation)`, 'color: #dc2626; font-weight: bold; background: #fef2f2; padding: 2px 6px; border-radius: 4px;', response.data)
  }
  else throw new Error('API endpoint not found')

  if(method==='GET') cache.set(cacheKey,response)
  else cache.clear()
  return response
}
