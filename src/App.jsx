import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, Newspaper, Search } from 'lucide-react';
import HomePage from './components/HomePage';
import CryptocurrenciesPage from './components/CryptocurrenciesPage';
import ExchangesPage from './components/ExchangesPage';
import NewsPage from './components/NewsPage';
import CryptoDetailPage from './components/CryptoDetailPage';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 1) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data.coins.slice(0, 5));
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearchSelect = (coin) => {
    navigate(`/crypto/${coin.id}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <TrendingUp size={32} />
          </div>
          <h1>Cryptoverse</h1>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" className="nav-item">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/cryptocurrencies" className="nav-item">
            <TrendingUp size={20} />
            <span>Cryptocurrencies</span>
          </Link>
          <Link to="/exchanges" className="nav-item">
            <BarChart3 size={20} />
            <span>Exchanges</span>
          </Link>
          <Link to="/news" className="nav-item">
            <Newspaper size={20} />
            <span>News</span>
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="search-container">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
          </div>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  className="search-result-item"
                  onClick={() => handleSearchSelect(coin)}
                >
                  <img src={coin.thumb} alt={coin.name} />
                  <div>
                    <div className="search-result-name">{coin.name}</div>
                    <div className="search-result-symbol">{coin.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cryptocurrencies" element={<CryptocurrenciesPage />} />
          <Route path="/exchanges" element={<ExchangesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/crypto/:id" element={<CryptoDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}