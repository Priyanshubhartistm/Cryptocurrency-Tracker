import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [topCryptos, setTopCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGlobalStats();
    fetchTopCryptos();
  }, []);

  const fetchGlobalStats = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/global');
      const data = await response.json();
      setGlobalStats(data.data);
    } catch (error) {
      console.error('Error fetching global stats:', error);
    }
  };

  const fetchTopCryptos = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
      );
      const data = await response.json();
      setTopCryptos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num?.toFixed(2)}`;
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num?.toString();
  };

  const getCryptoIcon = (symbol) => {
    const icons = {
      btc: '₿',
      eth: 'Ξ',
      usdt: '₮',
      bnb: 'BNB',
      xrp: 'XRP',
      usdc: '$',
      sol: '◎',
      ada: '₳',
      doge: 'Ð',
      trx: 'T'
    };
    return icons[symbol?.toLowerCase()] || symbol?.toUpperCase()?.slice(0, 1);
  };

  const getIconColor = (index) => {
    const colors = [
      '#f7931a', '#627eea', '#26a17b', '#f3ba2f',
      '#23292f', '#2775ca', '#9945ff', '#0033ad',
      '#c2a633', '#ff0013'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  const displayCryptos = showAll ? topCryptos : topCryptos.slice(0, 10);

  return (
    <div>
      {globalStats && (
        <div className="global-stats">
          <h2>Global Crypto Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Cryptocurrencies</div>
              <div className="stat-value">
                {globalStats.active_cryptocurrencies?.toLocaleString()}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Exchanges</div>
              <div className="stat-value">{globalStats.markets}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Market Cap:</div>
              <div className="stat-value">
                {formatNumber(globalStats.total_market_cap?.usd)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total 24h Volume</div>
              <div className="stat-value">
                {formatNumber(globalStats.total_volume?.usd)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Cryptocurrencies</div>
              <div className="stat-value">
                {globalStats.active_cryptocurrencies?.toLocaleString()}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Markets</div>
              <div className="stat-value">
                {formatLargeNumber(globalStats.markets)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="top-cryptos">
        <div className="top-cryptos-header">
          <h2>Top {showAll ? '100' : '10'} Cryptos In The World</h2>
          <button
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'Show more'}
          </button>
        </div>

        <div className="crypto-grid">
          {displayCryptos.map((crypto, index) => (
            <div
              key={crypto.id}
              className="crypto-card"
              onClick={() => navigate(`/crypto/${crypto.id}`)}
            >
              <div className="crypto-card-header">
                <div className="crypto-info">
                  <span className="crypto-rank">{crypto.market_cap_rank}.</span>
                  <span className="crypto-name">{crypto.name}</span>
                </div>
                <div
                  className="crypto-icon"
                  style={{ background: getIconColor(index) }}
                >
                  {crypto.image ? (
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {getCryptoIcon(crypto.symbol)}
                    </span>
                  )}
                </div>
              </div>

              <div className="crypto-details">
                <div className="crypto-detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">
                    {crypto.current_price >= 1
                      ? `$${crypto.current_price?.toLocaleString()}`
                      : `$${crypto.current_price}`}
                  </span>
                </div>
                <div className="crypto-detail-row">
                  <span className="detail-label">Market Cap:</span>
                  <span className="detail-value">
                    {formatNumber(crypto.market_cap)}
                  </span>
                </div>
                <div className="crypto-detail-row">
                  <span className="detail-label">Daily Change:</span>
                  <span
                    className={`detail-value ${
                      crypto.price_change_percentage_24h >= 0
                        ? 'change-positive'
                        : 'change-negative'
                    }`}
                  >
                    {crypto.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;