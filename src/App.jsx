import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
  { name: 'Portugal', covers: [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'Iceland', covers: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'Canada', covers: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504198458649-3128b932f49b?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'United States', covers: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'Norway', covers: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'Sweden', covers: [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'Denmark', covers: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528756514091-dee5ecaa3278?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop'
  ]},
  { name: 'Ireland', covers: [
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop'
  ]}
];

function ImageWithFallback({ srcList, alt, className }) {
  const [idx, setIdx] = useState(0);
  const fallback = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';
  const src = srcList[idx] || fallback;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setIdx(idx + 1)}
    />
  );
}

function CountryStrip({ country }) {
  return (
    <div className="strip">
      <ImageWithFallback srcList={country.covers} alt={country.name} className="img" />
      <div className="veil"></div>
      <div className="center">
        <h2 className="h1">{country.name}</h2>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('portfolio');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="main">
      <header className="header">
        <div className="container header-row">
          <div className="brand">Ryan Muratore</div>
          <nav className="nav">
            <button onClick={() => setView('portfolio')} className={view==='portfolio' ? 'active' : ''}>Portfolio</button>
            <button onClick={() => setView('videos')} className={view==='videos' ? 'active' : ''}>Videos</button>
            <button onClick={() => setView('shop')} className={view==='shop' ? 'active' : ''}>Shop</button>
            <button onClick={() => setCartOpen(true)}>Cart ({cart.length})</button>
          </nav>
        </div>
      </header>

      {view === 'portfolio' && (
        <section>
          {COUNTRIES.map(c => <CountryStrip key={c.name} country={c} />)}
        </section>
      )}
      {view === 'shop' && (
        <section className="container section">
          <div className="border">
            <strong>Shop</strong>
            <div className="muted">Framed previews and filters coming soon.</div>
          </div>
        </section>
      )}
      {view === 'videos' && (
        <section className="container section">
          <div className="border">
            <strong>Videos</strong>
            <div className="muted">Upload or link travel videos.</div>
          </div>
        </section>
      )}
    </div>
  );
}
