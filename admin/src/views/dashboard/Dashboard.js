import React, { useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CProgress,
  CProgressBar,
  CSpinner,
  CBadge,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { cilNewspaper, cilPencil, cilFolderOpen, cilTrash, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import setting from '../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const COLORS = {
  blue: '#2563eb',
  red: '#dc2626',
  green: '#059669',
  orange: '#ea580c',
  purple: '#7c3aed',
  cyan: '#0891b2',
}

const cardStyle = {
  border: 0,
  borderRadius: 16,
  overflow: 'hidden',
  minWidth: 0,
}

const decodeText = (value = '') => {
  const entities = {
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  }

  return String(value).replace(
    /&amp;|&quot;|&#39;|&#x27;|&lt;|&gt;|&nbsp;/gi,
    (entity) => entities[entity] || entity,
  )
}

const getTitle = (item) =>
  decodeText(item.title || item.heading || item.newsTitle || 'Untitled News')

const getViews = (item) => Number(item.views ?? item.viewCount ?? item.totalViews ?? 0) || 0

const getAuthorName = (item) => {
  if (item.author && typeof item.author === 'object') {
    return item.author.name || item.author.username || item.author.fullName || 'Unknown Author'
  }

  return item.authorName || item.author || 'Unknown Author'
}

const getValidDate = (value) => {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const isSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

const formatNumber = (number) => Number(number || 0).toLocaleString('en-IN')

const Dashboard = () => {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const loginInfo = secureLocalStorage.getItem('logininfo')
        const loginData = typeof loginInfo === 'string' ? JSON.parse(loginInfo) : loginInfo

        const token = loginData?.token

        const [newsResponse, categoryResponse] = await Promise.all([
          fetch(`${setting.api}/api/news/getAllNews`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${setting.api}/api/categories/getAllCategory`),
        ])

        if (!newsResponse.ok || !categoryResponse.ok) {
          throw new Error('Unable to load dashboard data.')
        }

        const [newsResult, categoryResult] = await Promise.all([
          newsResponse.json(),
          categoryResponse.json(),
        ])

        if (newsResult.status === false) {
          throw new Error(newsResult.message || 'Unable to load news.')
        }

        if (categoryResult.status === false) {
          throw new Error(categoryResult.message || 'Unable to load categories.')
        }

        if (!cancelled) {
          setNews(Array.isArray(newsResult.data) ? newsResult.data : [])
          setCategories(Array.isArray(categoryResult.data) ? categoryResult.data : [])
        }
      } catch (err) {
        console.error('Dashboard Error:', err)

        if (!cancelled) {
          setError(err.message || 'Something went wrong.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      cancelled = true
    }
  }, [])

  const analytics = useMemo(() => {
    const today = new Date()

    const activeNews = news.filter((item) => item.isDeleted !== true)
    const deletedNews = news.filter((item) => item.isDeleted === true)

    const publishedNews = activeNews.filter((item) => Number(item.type) === 1)

    const draftNews = activeNews.filter((item) => Number(item.type) === 2)

    const todaysPublishedNews = publishedNews.filter((item) => {
      const created = getValidDate(item.createdAt)
      return created && isSameDay(created, today)
    })

    const mostViewedNews = [...publishedNews].sort((a, b) => getViews(b) - getViews(a)).slice(0, 7)

    const authorsToday = Object.entries(
      todaysPublishedNews.reduce((result, item) => {
        const author = getAuthorName(item)
        result[author] = (result[author] || 0) + 1
        return result
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)

    const totalViews = publishedNews.reduce((sum, item) => sum + getViews(item), 0)

    const recentNews = [...activeNews]
      .sort(
        (a, b) =>
          (getValidDate(b.createdAt)?.getTime() || 0) - (getValidDate(a.createdAt)?.getTime() || 0),
      )
      .slice(0, 6)

    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - index))
      return date
    })

    const dailyPublishingCounts = lastSevenDays.map(
      (day) =>
        publishedNews.filter((item) => {
          const created = getValidDate(item.createdAt)
          return created && isSameDay(created, day)
        }).length,
    )

    return {
      activeNews,
      publishedNews,
      draftNews,
      deletedNews,
      todaysPublishedNews,
      mostViewedNews,
      authorsToday,
      totalViews,
      recentNews,
      lastSevenDays,
      dailyPublishingCounts,
    }
  }, [news])

  const stats = [
    {
      title: 'Total News',
      count: analytics.activeNews.length,
      icon: cilNewspaper,
      color: COLORS.blue,
      detail: 'All active articles',
    },
    {
      title: 'Published News',
      count: analytics.publishedNews.length,
      icon: cilNewspaper,
      color: COLORS.green,
      detail: 'Live articles',
    },
    {
      title: 'Draft News',
      count: analytics.draftNews.length,
      icon: cilPencil,
      color: COLORS.orange,
      detail: 'Pending publication',
    },
    {
      title: 'Categories',
      count: categories.length,
      icon: cilFolderOpen,
      color: COLORS.purple,
      detail: 'Available categories',
    },
    {
      title: 'Deleted News',
      count: analytics.deletedNews.length,
      icon: cilTrash,
      color: COLORS.red,
      detail: 'Deleted records',
    },
    {
      title: 'Total Views',
      count: analytics.totalViews,
      icon: cilNewspaper,
      color: COLORS.cyan,
      detail: 'Views on published articles',
    },
  ]

  const maxStat = Math.max(...stats.map((item) => item.count), 1)

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148,163,184,0.15)',
        },
        ticks: {
          precision: 0,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <CSpinner color="primary" />
        <span className="ms-3 text-body-secondary">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div
      className="container-fluid p-3 p-md-4"
      style={{
        background: '#f5f7fb',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Dashboard header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div style={{ minWidth: 0 }}>
          <h3 className="fw-bold mb-1" style={{ color: '#172033' }}>
            News Dashboard
          </h3>
          <p className="text-body-secondary mb-0">
            Bharat 19 Express · Content performance and analytics
          </p>
        </div>

        <CBadge color="success" className="px-3 py-2">
          Dashboard Overview
        </CBadge>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary cards */}
      <CRow className="g-3 mb-4">
        {stats.map((item) => (
          <CCol xs={12} sm={6} xl={4} key={item.title}>
            <CCard className="shadow-sm h-100" style={cardStyle}>
              <CCardBody className="p-3 p-md-4">
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div style={{ minWidth: 0 }}>
                    <div className="text-body-secondary small mb-2">{item.title}</div>

                    <h3 className="fw-bold mb-1" style={{ color: '#172033' }}>
                      {formatNumber(item.count)}
                    </h3>

                    <small className="text-body-secondary">{item.detail}</small>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: `${item.color}18`,
                      color: item.color,
                    }}
                  >
                    <CIcon icon={item.icon} size="xl" />
                  </div>
                </div>

                <CProgress className="mt-3" style={{ height: 5 }}>
                  <CProgressBar
                    value={Math.min((item.count / maxStat) * 100, 100)}
                    style={{ backgroundColor: item.color }}
                  />
                </CProgress>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Main analytics */}
      <CRow className="g-4 mb-4">
        {/* Most viewed news */}
        <CCol xs={12} xl={7}>
          <CCard className="shadow-sm h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              <h5 className="fw-bold mb-1">Most Viewed News</h5>
              <p className="text-body-secondary small mb-4">
                Top published articles ranked by total views
              </p>

              {analytics.mostViewedNews.some((item) => getViews(item) > 0) ? (
                <div style={{ height: 320, width: '100%', minWidth: 0 }}>
                  <CChartBar
                    data={{
                      labels: analytics.mostViewedNews.map((item) => {
                        const title = getTitle(item)
                        return title.length > 36 ? `${title.slice(0, 36)}…` : title
                      }),
                      datasets: [
                        {
                          label: 'Views',
                          backgroundColor: COLORS.blue,
                          borderRadius: 6,
                          data: analytics.mostViewedNews.map(getViews),
                          barThickness: 22,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilNewspaper} size="3xl" className="mb-3" />
                  <p className="fw-semibold mb-1">No view analytics available</p>
                  <small>Configure view tracking in the backend to display rankings.</small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Most published today */}
        <CCol xs={12} xl={5}>
          <CCard className="shadow-sm h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-1">
                <h5 className="fw-bold mb-0">Most Published Today</h5>
                <CBadge color="primary">{analytics.todaysPublishedNews.length} articles</CBadge>
              </div>

              <p className="text-body-secondary small mb-4">
                Authors ranked by published articles today
              </p>

              {analytics.authorsToday.length > 0 ? (
                <>
                  <div style={{ height: 260, width: '100%', minWidth: 0 }}>
                    <CChartBar
                      data={{
                        labels: analytics.authorsToday.map(([name]) =>
                          name.length > 22 ? `${name.slice(0, 22)}…` : name,
                        ),
                        datasets: [
                          {
                            label: 'Published articles',
                            backgroundColor: COLORS.green,
                            borderRadius: 6,
                            data: analytics.authorsToday.map(([, count]) => count),
                            barThickness: 22,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>

                  <div className="mt-3">
                    {analytics.authorsToday.slice(0, 5).map(([name, count], index) => (
                      <div
                        key={name}
                        className="d-flex justify-content-between align-items-center gap-2 py-3 border-bottom"
                      >
                        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: 30,
                              height: 30,
                              backgroundColor: index === 0 ? '#dcfce7' : '#f1f5f9',
                              color: index === 0 ? '#166534' : '#475569',
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {index + 1}
                          </span>

                          <span
                            className="fw-semibold"
                            style={{
                              minWidth: 0,
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {name}
                          </span>
                        </div>

                        <CBadge
                          color={index === 0 ? 'success' : 'secondary'}
                          className="flex-shrink-0"
                        >
                          {count} {count === 1 ? 'post' : 'posts'}
                        </CBadge>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilUser} size="3xl" className="mb-3" />
                  <p className="fw-semibold mb-1">No articles published today</p>
                  <small>Published articles will appear here automatically.</small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Publishing activity and recent news */}
      <CRow className="g-4">
        <CCol xs={12} xl={7}>
          <CCard className="shadow-sm h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              <h5 className="fw-bold mb-1">News Publishing Activity</h5>
              <p className="text-body-secondary small mb-4">
                Published articles created over the last seven days
              </p>

              <div style={{ height: 270, width: '100%', minWidth: 0 }}>
                <CChartLine
                  data={{
                    labels: analytics.lastSevenDays.map((day) =>
                      day.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      }),
                    ),
                    datasets: [
                      {
                        label: 'Published news',
                        data: analytics.dailyPublishingCounts,
                        borderColor: COLORS.blue,
                        backgroundColor: 'rgba(37,99,235,0.12)',
                        pointBackgroundColor: COLORS.blue,
                        pointRadius: 4,
                        fill: true,
                        tension: 0.35,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                      },
                      x: {
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Recent news - overflow fixed */}
        <CCol xs={12} xl={5}>
          <CCard className="shadow-sm h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                <h5 className="fw-bold mb-0">Recent News</h5>
                <CBadge color="secondary">{analytics.recentNews.length} articles</CBadge>
              </div>

              <p className="text-body-secondary small mb-3">Latest content and publishing status</p>

              {analytics.recentNews.length > 0 ? (
                analytics.recentNews.map((item) => (
                  <div
                    key={item._id}
                    className="py-3 border-bottom"
                    style={{
                      minWidth: 0,
                      width: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="fw-semibold mb-2"
                      title={getTitle(item)}
                      style={{
                        fontSize: '0.93rem',
                        lineHeight: 1.55,
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {getTitle(item)}
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <small
                        className="text-body-secondary"
                        style={{
                          minWidth: 0,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {getAuthorName(item)}
                        {' · '}
                        {getValidDate(item.createdAt)
                          ? getValidDate(item.createdAt).toLocaleDateString('en-IN')
                          : 'Date unavailable'}
                      </small>

                      <CBadge color={Number(item.type) === 1 ? 'success' : 'warning'}>
                        {Number(item.type) === 1 ? 'Published' : 'Draft'}
                      </CBadge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilNewspaper} size="3xl" className="mb-3" />
                  <p className="mb-0">No news found.</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
