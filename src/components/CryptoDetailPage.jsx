import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './CryptoDetailPage.css';

const CryptoDetailPage = () => {
  const { id } = useParams();
  const [crypto, setCrypto] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoData();
    fetchChartData();
  }, [id, timeRange]);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=true&developer_data=false`
      );
      const data = await response.json();
      setCrypto(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${timeRange}`
      );
      const data = await response.json();
      
      const formattedData = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: timeRange === '1' ? '2-digit' : undefined,
          minute: timeRange === '1' ? '2-digit' : undefined
        }),
        price: price
      }));
      
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
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

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return price >= 1 ? `$${price.toLocaleString()}` : `$${price}`;
  };

  if (loading) {
    return <div className="loading">Loading crypto data...</div>;
  }

  if (!crypto) {
    return <div className="loading">Crypto not found</div>;
  }

  const priceChange = crypto.market_data?.price_change_percentage_24h || 0;
  const currentPrice = crypto.market_data?.current_price?.usd || 0;

  return (
    <div className="crypto-detail-page">
      <div className="crypto-header">
        <h1>{crypto.name} ({crypto.symbol?.toUpperCase()}) Price</h1>
        <p className="crypto-description">
          {crypto.name} live price in US Dollar (USD). View value statistics, market cap and supply.
        </p>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <div className="time-filters">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="1">24h</option>
              <option value="7">7d</option>
              <option value="30">30d</option>
              <option value="90">90d</option>
              <option value="365">1y</option>
            </select>
          </div>
          <h2>{crypto.name} Price Chart</h2>
        </div>

        <div className="current-price-info">
          <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            Change: {priceChange.toFixed(2)}%
          </span>
          <span className="current-price">
            Current {crypto.name} Price: {formatPrice(currentPrice)}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price in USD']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-section">
        <div className="stats-column">
          <h3>{crypto.name} Value Statistics</h3>
          <p className="stats-description">
            An overview showing the statistics of {crypto.name}, such as the base and quote currency, the rank, and trading volume.
          </p>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">💲</span>
              Price to USD
            </div>
            <div className="stat-value">{formatPrice(currentPrice)}</div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">#</span>
              Rank
            </div>
            <div className="stat-value">{crypto.market_cap_rank || 'N/A'}</div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">📊</span>
              24h Volume
            </div>
            <div className="stat-value">
              {formatNumber(crypto.market_data?.total_volume?.usd)}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">💰</span>
              Market Cap
            </div>
            <div className="stat-value">
              {formatNumber(crypto.market_data?.market_cap?.usd)}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">🏆</span>
              All-time-high (daily avg.)
            </div>
            <div className="stat-value">
              {formatPrice(crypto.market_data?.ath?.usd)}
            </div>
          </div>
        </div>

        <div className="stats-column">
          <h3>Other Stats Info</h3>
          <p className="stats-description">
            An overview showing the statistics of {crypto.name}, such as the base and quote currency, the rank, and trading volume.
          </p>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">🏪</span>
              Number Of Markets
            </div>
            <div className="stat-value">
              {crypto.tickers?.length || 'N/A'}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">🔄</span>
              Number Of Exchanges
            </div>
            <div className="stat-value">
              {crypto.market_data?.number_of_exchanges || 'N/A'}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">✅</span>
              Approved Supply
            </div>
            <div className="stat-value">
              {crypto.market_data?.circulating_supply ? '✓' : '✗'}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">📦</span>
              Total Supply
            </div>
            <div className="stat-value">
              {crypto.market_data?.total_supply
                ? formatNumber(crypto.market_data.total_supply)
                : 'N/A'}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">
              <span className="stat-icon">🔁</span>
              Circulating Supply
            </div>
            <div className="stat-value">
              {crypto.market_data?.circulating_supply
                ? formatNumber(crypto.market_data.circulating_supply)
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {crypto.description?.en && (
        <div className="description-section">
          <h3>What is {crypto.name}?</h3>
          <div
            className="description-text"
            dangerouslySetInnerHTML={{
              __html: crypto.description.en.split('</p>')[0] + '</p>'
            }}
          />
        </div>
      )}

      {crypto.links && (
        <div className="links-section">
          <h3>{crypto.name} Links</h3>
          <div className="links-grid">
            {crypto.links.homepage?.[0] && (
              <a
                href={crypto.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="link-item"
              >
                🌐 Website
              </a>
            )}
            {crypto.links.blockchain_site?.[0] && (
              <a
                href={crypto.links.blockchain_site[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="link-item"
              >
                🔗 Blockchain Explorer
              </a>
            )}
            {crypto.links.official_forum_url?.[0] && (
              <a
                href={crypto.links.official_forum_url[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="link-item"
              >
                💬 Forum
              </a>
            )}
            {crypto.links.subreddit_url && (
              <a
                href={crypto.links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-item"
              >
                📱 Reddit
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDetailPage;