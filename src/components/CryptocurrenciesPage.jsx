import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CryptocurrenciesPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCryptos();
  }, [page]);

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false&price_change_percentage=24h`
      );
      const data = await response.json();
      setCryptos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cryptocurrencies:', error);
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

  if (loading) {
    return <div className="loading">Loading cryptocurrencies...</div>;
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', color: '#1f2937' }}>All Cryptocurrencies</h1>
        <p style={{ color: '#6b7280', marginTop: '10px' }}>
          Browse all cryptocurrencies ranked by market capitalization
        </p>
      </div>

      <div className="crypto-table-container" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <table className="crypto-table" style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              borderBottom: '2px solid #e5e7eb',
              textAlign: 'left'
            }}>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Rank</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Price</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>24h Change</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Market Cap</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => (
              <tr
                key={crypto.id}
                onClick={() => navigate(`/crypto/${crypto.id}`)}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#6b7280' }}>
                  {crypto.market_cap_rank}
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{crypto.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#1f2937' }}>
                  {crypto.current_price >= 1
                    ? `$${crypto.current_price.toLocaleString()}`
                    : `$${crypto.current_price}`}
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <span style={{
                    color: crypto.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#1f2937' }}>
                  {formatNumber(crypto.market_cap)}
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#1f2937' }}>
                  {formatNumber(crypto.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '30px'
        }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: page === 1 ? '#e5e7eb' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: page === 1 ? '#9ca3af' : 'white',
              fontWeight: '600',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (page !== 1) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Previous
          </button>
          <span style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            color: '#1f2937',
            fontWeight: '600'
          }}>
            Page {page}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptocurrenciesPage;