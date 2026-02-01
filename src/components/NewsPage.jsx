import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Using CoinGecko's status updates as news
      const response = await fetch('https://api.coingecko.com/api/v3/status_updates?per_page=30');
      const data = await response.json();
      setNews(data.status_updates || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to sample news
      setNews([
        {
          id: 1,
          title: 'Bitcoin Reaches New Heights',
          description: 'Bitcoin continues its bullish trend as institutional adoption increases.',
          created_at: new Date().toISOString(),
          project: { name: 'Bitcoin', image: { thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png' } }
        },
        {
          id: 2,
          title: 'Ethereum 2.0 Updates',
          description: 'Latest developments in Ethereum\'s transition to proof-of-stake.',
          created_at: new Date().toISOString(),
          project: { name: 'Ethereum', image: { thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' } }
        }
      ]);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', color: '#1f2937' }}>Crypto News & Updates</h1>
        <p style={{ color: '#6b7280', marginTop: '10px' }}>
          Stay updated with the latest cryptocurrency news and market updates
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {news.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.15)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '15px'
            }}>
              {item.project?.image?.thumb && (
                <img
                  src={item.project.image.thumb}
                  alt={item.project.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              )}
              <div>
                <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '18px' }}>
                  {item.project?.name || 'Crypto Update'}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#6b7280',
                  fontSize: '13px',
                  marginTop: '4px'
                }}>
                  <Calendar size={14} />
                  {formatDate(item.created_at)}
                </div>
              </div>
            </div>

            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '12px',
              lineHeight: '1.5'
            }}>
              {item.user_title || item.description?.substring(0, 80) || 'Cryptocurrency Update'}
            </h3>

            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '15px'
            }}>
              {item.description
                ? item.description.length > 150
                  ? item.description.substring(0, 150) + '...'
                  : item.description
                : 'Stay updated with the latest cryptocurrency developments and market trends.'}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#667eea',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Read more
              <ExternalLink size={16} />
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ fontSize: '20px', color: '#6b7280', marginBottom: '10px' }}>
            No news available at the moment
          </h3>
          <p style={{ color: '#9ca3af' }}>
            Check back later for the latest crypto updates
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
