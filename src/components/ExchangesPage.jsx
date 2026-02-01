import React, { useState, useEffect } from 'react';

const ExchangesPage = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/exchanges?per_page=50'
      );
      const data = await response.json();
      setExchanges(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num?.toFixed(2)}`;
  };

  if (loading) {
    return <div className="loading">Loading exchanges...</div>;
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', color: '#1f2937' }}>Top Cryptocurrency Exchanges</h1>
        <p style={{ color: '#6b7280', marginTop: '10px' }}>
          Browse the top cryptocurrency exchanges by trading volume
        </p>
      </div>

      <div className="exchanges-container" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              borderBottom: '2px solid #e5e7eb',
              textAlign: 'left'
            }}>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Rank</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Exchange</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Trading Volume (24h)</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Trust Score</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Markets</th>
              <th style={{ padding: '15px 10px', color: '#6b7280', fontWeight: '600' }}>Year Established</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange, index) => (
              <tr
                key={exchange.id}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                onClick={() => window.open(exchange.url, '_blank')}
              >
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#6b7280' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={exchange.image}
                      alt={exchange.name}
                      style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                    />
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{exchange.name}</div>
                  </div>
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#1f2937' }}>
                  {formatNumber(exchange.trade_volume_24h_btc * 50000)}
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: exchange.trust_score >= 8 ? '#dcfce7' : exchange.trust_score >= 6 ? '#fef3c7' : '#fee2e2',
                    color: exchange.trust_score >= 8 ? '#16a34a' : exchange.trust_score >= 6 ? '#ca8a04' : '#dc2626',
                    fontWeight: '600'
                  }}>
                    {exchange.trust_score}/10
                  </div>
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#1f2937' }}>
                  {exchange.markets || 'N/A'}
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '600', color: '#1f2937' }}>
                  {exchange.year_established || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExchangesPage;