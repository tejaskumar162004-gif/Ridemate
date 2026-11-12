import { useMemo, useState } from 'react'
import {
  Bike, Home, Search, CalendarDays, PlusCircle, UserRound, MapPin,
  Star, ShieldCheck, Clock3, ArrowLeft, CheckCircle2, Menu, X,
  SlidersHorizontal, WalletCards, Headphones, Languages, ChevronRight
} from 'lucide-react'

const cities = ['Bengaluru', 'Mysuru', 'Mangaluru', 'Chennai', 'Hyderabad', 'Kochi', 'Coimbatore', 'Vijayawada']
const initialBikes = [
  { id: 1, name: 'Honda Activa 6G', type: 'Scooter', emoji: '🛵', price: 70, location: 'Indiranagar, Bengaluru', rating: 4.8, details: 'Smooth and easy city ride', tag: 'Popular' },
  { id: 2, name: 'Royal Enfield Hunter 350', type: 'Cruiser', emoji: '🏍️', price: 180, location: 'Koramangala, Bengaluru', rating: 4.9, details: 'Comfortable weekend ride', tag: 'Top rated' },
  { id: 3, name: 'Yamaha MT-15', type: 'Street', emoji: '🏍️', price: 150, location: 'Whitefield, Bengaluru', rating: 4.7, details: 'Sporty street performance', tag: 'Verified' },
  { id: 4, name: 'Bajaj Pulsar N160', type: 'Street', emoji: '🏍️', price: 120, location: 'Mysuru Road, Bengaluru', rating: 4.6, details: 'Great for everyday travel', tag: 'Value pick' },
  { id: 5, name: 'TVS Jupiter', type: 'Scooter', emoji: '🛵', price: 65, location: 'Jayanagar, Bengaluru', rating: 4.7, details: 'Comfortable everyday scooter', tag: 'Easy ride' },
  { id: 6, name: 'Classic 350', type: 'Cruiser', emoji: '🏍️', price: 200, location: 'HSR Layout, Bengaluru', rating: 4.9, details: 'Relaxed long-distance ride', tag: 'Premium' }
]

function App() {
  const [page, setPage] = useState('home')
  const [city, setCity] = useState('Bengaluru')
  const [filter, setFilter] = useState('All')
  const [selectedBike, setSelectedBike] = useState(null)
  const [duration, setDuration] = useState(1)
  const [bookings, setBookings] = useState([])
  const [listing, setListing] = useState({ name: '', city: 'Bengaluru', price: '', phone: '' })
  const [language, setLanguage] = useState('English')
  const [notice, setNotice] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const visibleBikes = useMemo(() => initialBikes.filter(b => filter === 'All' || b.type === filter), [filter])
  const openBike = bike => { setSelectedBike(bike); setDuration(1); setPage('detail'); setNotice('') }
  const navigate = next => { setPage(next); setMobileMenu(false); setNotice('') }
  const requestBooking = () => {
    if (!selectedBike) return
    const booking = { id: Date.now(), bike: selectedBike.name, city, duration, amount: selectedBike.price * duration, status: 'Awaiting owner response' }
    setBookings(prev => [booking, ...prev])
    setPage('confirmation')
  }
  const submitListing = e => {
    e.preventDefault()
    if (!listing.name.trim() || !listing.price || !listing.phone.trim()) {
      setNotice('Please complete all listing fields.')
      return
    }
    setNotice('Your demo listing details have been captured. Verification is required before publishing.')
  }

  const navItems = [
    ['home', 'Home', Home], ['explore', 'Explore', Search], ['bookings', 'Bookings', CalendarDays],
    ['list', 'List bike', PlusCircle], ['profile', 'Profile', UserRound]
  ]

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => navigate('home')}><span className="brand-mark"><Bike size={22}/></span>Ride<span>Mate</span></button>
      <div className="top-actions">
        <label className="city-select"><MapPin size={15}/><select value={city} onChange={e => setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select></label>
        <button className="menu-toggle" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <div className={`layout ${mobileMenu ? 'menu-open' : ''}`}>
      <aside className="sidebar">
        <div className="side-label">MENU</div>
        {navItems.map(([id, label, Icon]) => <button key={id} className={`side-link ${page === id ? 'active' : ''}`} onClick={() => navigate(id)}><Icon size={18}/>{label}</button>)}
        <div className="side-help"><div className="help-icon"><Headphones size={19}/></div><b>Need a hand?</b><p>Our support team is here to help with your ride.</p><button onClick={() => setNotice('Support contact will be available in the production app.')}>Get support <ChevronRight size={14}/></button></div>
        <div className="side-foot">© 2026 RideMate</div>
      </aside>

      <main className="main-content">
        {page === 'home' && <HomePage city={city} setCity={setCity} setFilter={setFilter} onExplore={() => navigate('explore')} onBike={openBike}/>}
        {page === 'explore' && <section>
          <PageHeading eyebrow="FIND YOUR RIDE" title={<>Explore <em>bikes.</em></>} subtitle="Choose a ride that fits your plan."/>
          <div className="filter-row"><SlidersHorizontal size={17}/>{['All','Scooter','Cruiser','Street'].map(t => <button key={t} className={`chip ${filter === t ? 'selected' : ''}`} onClick={() => setFilter(t)}>{t === 'All' ? 'All bikes' : t}</button>)}</div>
          <div className="bike-grid">{visibleBikes.map(b => <BikeCard key={b.id} bike={b} onClick={() => openBike(b)}/>)}</div>
        </section>}
        {page === 'detail' && selectedBike && <section>
          <button className="back-link" onClick={() => navigate('explore')}><ArrowLeft size={16}/> Back to bikes</button>
          <div className="detail-grid"><div>
            <div className="bike-hero">{selectedBike.emoji}<span className="hero-tag"><ShieldCheck size={14}/> Owner verified (demo)</span></div>
            <div className="detail-title"><div><PageHeading eyebrow={selectedBike.type.toUpperCase()} title={selectedBike.name} subtitle={<><MapPin size={14}/> {selectedBike.location}</>}/></div><div className="rating"><Star size={16} fill="currentColor"/> {selectedBike.rating}</div></div>
            <div className="spec-grid"><Spec icon={<Clock3/>} title="Flexible" text="Hourly rental"/><Spec icon={<ShieldCheck/>} title="Verified" text="Owner checks"/><Spec icon={<MapPin/>} title="Nearby" text="Local pickup"/></div>
            <div className="panel"><h3>About this bike</h3><p>{selectedBike.details}. Check the final listing for exact model year, condition, pickup point, helmet availability and fuel policy.</p></div>
          </div><aside className="booking-panel">
            <div className="eyebrow">BOOK THIS RIDE</div><div className="big-price">₹{selectedBike.price}<small> / hour</small></div>
            <label className="form-label">Pickup city<select value={city} onChange={e => setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select></label>
            <label className="form-label">Rental duration<select value={duration} onChange={e => setDuration(Number(e.target.value))}><option value={1}>1 hour</option><option value={4}>4 hours</option><option value={8}>8 hours</option><option value={24}>1 day (24 hours)</option></select></label>
            <div className="cost-line"><span>Rental estimate</span><b>₹{selectedBike.price * duration}</b></div><div className="cost-line muted"><span>Illustrative refundable deposit</span><span>₹1,000</span></div><div className="cost-total"><span>Estimated total</span><b>₹{selectedBike.price * duration + 1000}</b></div>
            <button className="primary-btn full" onClick={requestBooking}>Request booking <ChevronRight size={17}/></button>
            <p className="fine-print">Demo only: no payment is collected. Final charges and deposit must be shown before checkout.</p>
          </aside></div>
        </section>}
        {page === 'bookings' && <section><PageHeading eyebrow="YOUR RIDES" title={<>Your <em>bookings.</em></>} subtitle="Manage your requested and upcoming rides."/>
          {bookings.length === 0 ? <div className="empty-state"><div className="empty-icon"><CalendarDays size={30}/></div><h3>No bookings yet</h3><p>Your booking requests will appear here when you choose a bike.</p><button className="primary-btn" onClick={() => navigate('explore')}>Find a bike <ChevronRight size={16}/></button></div> :
          <div className="booking-list">{bookings.map(b => <div className="booking-item" key={b.id}><div className="booking-symbol">🏍️</div><div className="booking-info"><b>{b.bike}</b><span>{b.city} · {b.duration} hour(s)</span><small>{b.status}</small></div><strong>₹{b.amount}</strong></div>)}</div>}
        </section>}
        {page === 'list' && <section className="narrow"><PageHeading eyebrow="FOR BIKE OWNERS" title={<>Share your bike.<br/><em>Earn locally.</em></>} subtitle="List your bike and connect with verified renters in your city."/>
          <form className="panel listing-form" onSubmit={submitListing}><label className="form-label">Bike brand and model<input value={listing.name} onChange={e => setListing({...listing, name:e.target.value})} placeholder="e.g. Honda Activa 6G"/></label><label className="form-label">City<select value={listing.city} onChange={e => setListing({...listing, city:e.target.value})}>{cities.map(c => <option key={c}>{c}</option>)}</select></label><label className="form-label">Price per hour (₹)<input type="number" min="1" value={listing.price} onChange={e => setListing({...listing, price:e.target.value})} placeholder="e.g. 80"/></label><label className="form-label">Contact number<input type="tel" value={listing.phone} onChange={e => setListing({...listing, phone:e.target.value})} placeholder="10-digit mobile number"/></label><button className="primary-btn full">Submit bike details <ChevronRight size={17}/></button>{notice && <p className="inline-notice">{notice}</p>}</form>
          <div className="notice-card"><ShieldCheck/><div><b>Safety comes first</b><p>Production listings should verify ownership, RC, insurance, PUC, vehicle condition and applicable rental permissions before publishing.</p></div></div>
        </section>}
        {page === 'profile' && <section className="narrow"><PageHeading eyebrow="ACCOUNT" title={<>Your <em>profile.</em></>} subtitle="Manage your RideMate preferences and safety details."/><div className="profile-card"><div className="avatar"><UserRound size={28}/></div><div><b>Welcome to RideMate</b><p>Sign in to manage your account, KYC and payments.</p></div><span className="demo-badge">Prototype</span></div><div className="panel settings-panel"><div className="setting-row"><div className="setting-icon"><ShieldCheck/></div><div><b>Identity verification</b><p>Driving licence and identity checks</p></div><ChevronRight/></div><div className="setting-row"><div className="setting-icon"><WalletCards/></div><div><b>Payments & deposits</b><p>UPI, cards and refunds</p></div><ChevronRight/></div><div className="setting-row"><div className="setting-icon"><Languages/></div><div><b>App language</b><p>Choose your preferred language</p></div><select value={language} onChange={e => setLanguage(e.target.value)}><option>English</option><option>Kannada</option><option>Tamil</option><option>Telugu</option><option>Malayalam</option></select></div></div><div className="notice-card"><Headphones/><div><b>Help & safety</b><p>Support, trip photo checks, dispute handling and emergency contact options.</p></div></div></section>}
        {page === 'confirmation' && <div className="confirmation"><div className="confirm-icon"><CheckCircle2 size={46}/></div><PageHeading eyebrow="DEMO CONFIRMATION" title={<>Request <em>created!</em></>} subtitle="Your sample booking request has been added to Bookings."/><p className="fine-print">No live booking, owner notification or payment has taken place.</p><button className="primary-btn" onClick={() => navigate('bookings')}>View bookings</button><button className="text-btn" onClick={() => navigate('home')}>Back to home</button></div>}
        {notice && page !== 'list' && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
        <footer className="mobile-footer">RideMate · Your Ride. Your Time. Your City.</footer>
      </main>
    </div>
  </div>
}

function PageHeading({eyebrow,title,subtitle}) { return <div className="page-heading"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div> }
function HomePage({city,setCity,setFilter,onExplore,onBike}) {
  const [pickup,setPickup] = useState('')
  const [returnDate,setReturnDate] = useState('')
  return <section>
    <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> PEER-TO-PEER BIKE RENTALS</div><h1>Your city.<br/>Your next <em>ride.</em></h1><p>Discover bikes from people around you. Simple, flexible rides for everyday plans and weekend escapes.</p><div className="hero-actions"><button className="primary-btn" onClick={onExplore}>Explore bikes <ChevronRight size={17}/></button><span><ShieldCheck size={15}/> Built around safer local rentals</span></div></div>
    <div className="search-panel"><div className="search-title"><div><span className="eyebrow">PLAN YOUR RIDE</span><h2>Where are you heading?</h2></div><div className="search-badge"><MapPin size={15}/> SOUTH INDIA</div></div><div className="search-fields"><label className="form-label">Pickup city<select value={city} onChange={e => setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select></label><label className="form-label">Pickup date<input type="date" value={pickup} onChange={e => setPickup(e.target.value)}/></label><label className="form-label">Return date<input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}/></label><button className="primary-btn search-button" onClick={onExplore}><Search size={17}/> Search bikes</button></div></div>
    <div className="section-heading"><div><div className="eyebrow">PICK YOUR STYLE</div><h2>Explore by category</h2></div><button className="text-link" onClick={onExplore}>View all bikes <ChevronRight size={15}/></button></div>
    <div className="category-grid">{[['🛵','Scooters','Easy city travel'],['🏍️','Cruisers','Relaxed longer rides'],['⚡','Street','Everyday performance']].map(([emoji,name,desc])=><button className="category-card" key={name} onClick={()=>{setFilter(name==='Scooters'?'Scooter':name==='Cruisers'?'Cruiser':'Street');onExplore()}}><span>{emoji}</span><b>{name}</b><small>{desc}</small></button>)}</div>
    <div className="section-heading"><div><div className="eyebrow">COMMUNITY PICKS</div><h2>Popular rides</h2></div><button className="text-link" onClick={onExplore}>See all <ChevronRight size={15}/></button></div>
    <div className="bike-grid">{initialBikes.slice(0,3).map(b=><BikeCard key={b.id} bike={b} onClick={()=>onBike(b)}/>)}</div>
    <div className="trust-strip"><div><ShieldCheck/><b>Verified profiles</b><span>Trust-focused onboarding</span></div><div><WalletCards/><b>Clear pricing</b><span>Know charges upfront</span></div><div><Headphones/><b>Local support</b><span>Help when you need it</span></div></div>
  </section>
}
function BikeCard({bike,onClick}) { return <button className="bike-card" onClick={onClick}><div className="bike-visual"><span className="bike-emoji">{bike.emoji}</span><span className="bike-tag">{bike.tag}</span><span className="verified"><ShieldCheck size={13}/></span></div><div className="bike-card-body"><div className="bike-card-top"><span className="bike-type">{bike.type}</span><span className="card-rating"><Star size={13} fill="currentColor"/> {bike.rating}</span></div><h3>{bike.name}</h3><p><MapPin size={13}/>{bike.location}</p><div className="bike-card-bottom"><strong>₹{bike.price}<small> / hour</small></strong><span>View details <ChevronRight size={14}/></span></div></div></button> }
function Spec({icon,title,text}) { return <div className="spec"><span>{icon}</span><div><b>{title}</b><small>{text}</small></div></div> }

export default App
