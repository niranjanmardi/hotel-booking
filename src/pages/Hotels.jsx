import {useEffect,useMemo,useState} from 'react';import {useLocation,useNavigate} from 'react-router-dom';import {SlidersHorizontal,Search,MapPin} from 'lucide-react';import {apiRequest} from '../services/api';import {filterHotels} from '../services/search';import {HotelCard,Loading,ErrorMessage} from '../components/UI'
export default function Hotels(){
  const navigate=useNavigate();
  const location=useLocation();
  const query=useMemo(()=>new URLSearchParams(location.search),[location.search]);
  const [hotels,setHotels]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [search,setSearch]=useState(query.get('location')||'');
  const [rating,setRating]=useState('all');
  const [maxPrice,setMaxPrice]=useState(16000);

  useEffect(()=>{
    const locParam=query.get('location');
    if(locParam!==null){
      setSearch(locParam);
    }
  },[query]);

  useEffect(()=>{
    setLoading(true);
    apiRequest('/hotels')
      .then(r=>setHotels(r.data))
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  },[]);

  const filtered=useMemo(()=>filterHotels(hotels,{search,rating,maxPrice}),[hotels,search,rating,maxPrice]);

  return <div className="page-shell">
    <div className="page-heading">
      <div>
        <span className="kicker">Explore stays</span>
        <h1>Go somewhere <em>good.</em></h1>
        <p>Search our collection of characterful stays across India.</p>
      </div>
      <div className="result-count">{filtered.length} stays found</div>
    </div>
    <div className="filter-layout">
      <aside className="filter-panel">
        <div className="filter-title"><SlidersHorizontal size={18}/> Refine your search</div>
        <label>Destination<input className="input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Any destination"/></label>
        <label>Minimum rating<select className="input" value={rating} onChange={e=>setRating(e.target.value)}><option value="all">Any rating</option><option value="4.5">4.5+</option><option value="4.7">4.7+</option><option value="4.8">4.8+</option></select></label>
        <label>Maximum nightly price <strong>₹{Number(maxPrice).toLocaleString('en-IN')}</strong><input type="range" min="5000" max="16000" step="500" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/></label>
        <div className="filter-tip"><MapPin size={17}/><span>Tip: try a city name or property name.</span></div>
      </aside>
      <section className="hotel-results">
        <div className="mobile-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by place or hotel"/></div>
        {loading?<Loading/>:error?<ErrorMessage message={error} onRetry={()=>window.location.reload()}/>:filtered.length===0?<div className="empty-state"><h3>No hotels available</h3><p>Try widening your price or rating filters.</p></div>:<div className="hotel-grid">{filtered.map(h=><HotelCard key={h.id} hotel={h} onSelect={hotel=>navigate(`/hotel/${hotel.id}`)}/>)}</div>}
      </section>
    </div>
  </div>;
}
