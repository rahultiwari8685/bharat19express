
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
  CBadge,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import {
  cilNewspaper,
  cilPencil,
  cilInfo,
  cilChartLine,
  cilCalendar,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import setting from '../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const COLORS = {
  blue: '#2563eb',
  green: '#059669',
  orange: '#ea580c',
  purple: '#7c3aed',
  cyan: '#0891b2',
}

const GRADIENTS = {
  blue: 'linear-gradient(135deg, #2563eb, #0891b2)',
  green: 'linear-gradient(135deg, #059669, #10b981)',
  orange: 'linear-gradient(135deg, #ea580c, #f59e0b)',
  purple: 'linear-gradient(135deg, #7c3aed, #a855f7)',
}

const cardStyle = {
  border: '1px solid rgba(226,232,240,0.8)',
  borderRadius: 14,
  overflow: 'hidden',
  minWidth: 0,
  boxShadow: '0 5px 20px rgba(15,23,42,0.045)',
}

const panelStyle = {
  border: '1px solid #e8edf5',
  borderRadius: 14,
  boxShadow: '0 5px 20px rgba(15,23,42,0.04)',
  height: '100%',
}

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('en-IN')

const getTitle = (item) =>
  item?.title || item?.heading || 'Untitled News'

const getValidDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const getNewsStatus = (news) => {
  const type = Number(news.newsType ?? news.type)

  if (type === 1) return { label: 'Published', color: 'success' }
  if (type === 2) return { label: 'Draft', color: 'warning' }
  if (type === 3) return { label: 'Scheduled', color: 'info' }

  return { label: 'Unknown', color: 'secondary' }
}

const CorrespondenceDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalPublished: 0,
    todayPublished: 0,
    drafts: 0,
    totalViews: 0,
    mostViewed: [],
    publishingActivity: [],
    recentNews: [],
  })

  const [correspondentName, setCorrespondentName] = useState('Correspondent')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const loginInfo = secureLocalStorage.getItem('logininfo')

      const loginData =
        typeof loginInfo === 'string'
          ? JSON.parse(loginInfo)
          : loginInfo

      const token = loginData?.token

      setCorrespondentName(loginData?.user?.name || 'Correspondent')

      if (!token) {
        throw new Error('Login session not found. Please login again.')
      }

      const response = await fetch(
        `${setting.api}/api/dashboard/correspondence`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const result = await response.json()

      if (!response.ok || result.status === false) {
        throw new Error(
          result.message || 'Unable to load correspondence dashboard.',
        )
      }

      const data = result.data || {}

      setDashboard({
        totalPublished: Number(data.totalPublished || 0),
        todayPublished: Number(data.todayPublished || 0),
        drafts: Number(data.drafts || 0),
        totalViews: Number(data.totalViews || 0),
        mostViewed: Array.isArray(data.mostViewed)
          ? data.mostViewed
          : [],
        publishingActivity: Array.isArray(data.publishingActivity)
          ? data.publishingActivity
          : [],
        recentNews: Array.isArray(data.recentNews)
          ? data.recentNews
          : [],
      })
    } catch (err) {
      console.error('Correspondence Dashboard Error:', err)
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const stats = [
    {
      title: 'Total Published',
      count: dashboard.totalPublished,
      detail: 'Your published articles',
      icon: cilNewspaper,
      color: COLORS.blue,
      gradient: GRADIENTS.blue,
    },
    {
      title: 'Published Today',
      count: dashboard.todayPublished,
      detail: 'Articles published today',
      icon: cilCalendar,
      color: COLORS.green,
      gradient: GRADIENTS.green,
    },
    {
      title: 'Draft News',
      count: dashboard.drafts,
      detail: 'Your saved drafts',
      icon: cilPencil,
      color: COLORS.orange,
      gradient: GRADIENTS.orange,
    },
    {
      title: 'Total Views',
      count: dashboard.totalViews,
      detail: 'Views on your published news',
      icon: cilInfo,
      color: COLORS.purple,
      gradient: GRADIENTS.purple,
    },
  ]

  const mostViewed = dashboard.mostViewed
  const activity = dashboard.publishingActivity
  const recentNews = dashboard.recentNews

  const maxStat = Math.max(...stats.map((item) => item.count), 1)

  const panelHeading = (icon, title, subtitle, color) => (
    <div className="d-flex align-items-center gap-3 mb-4">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: 46,
          height: 46,
          color: '#fff',
          background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        }}
      >
        <CIcon icon={icon} size="lg" />
      </div>

      <div style={{ minWidth: 0 }}>
        <h5 className="fw-bold mb-1" style={{ color: '#172033' }}>
          {title}
        </h5>
        <p className="text-body-secondary small mb-0">{subtitle}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <CSpinner color="primary" />
        <span className="ms-3 text-body-secondary">
          Loading correspondence dashboard...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <CCard className="border-0 shadow-sm" style={cardStyle}>
          <CCardBody className="text-center p-5">
            <div className="mb-3">
              <CIcon icon={cilInfo} size="3xl" className="text-danger" />
            </div>
            <h5 className="fw-bold">Unable to load dashboard</h5>
            <p className="text-body-secondary">{error}</p>
            <CButton color="primary" onClick={fetchDashboard}>
              Retry
            </CButton>
          </CCardBody>
        </CCard>
      </div>
    )
  }

  return (
    <div
      className="container-fluid p-3 p-md-4"
      style={{
        background: '#f3f6fc',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Welcome Banner */}
      <div
        className="mb-4 position-relative"
        style={{
          background:
            'radial-gradient(circle at 85% 20%, #2563eb 0, transparent 30%), linear-gradient(115deg, #101b3d, #172554 60%, #312e81)',
          borderRadius: 20,
          padding: '30px 28px',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <CBadge
              color="light"
              className="px-3 py-2"
              style={{ color: '#1d4ed8', borderRadius: 20 }}
            >
              CORRESPONDENCE PANEL
            </CBadge>
            <span className="small text-white-50">● Dashboard Overview</span>
          </div>

          <h2 className="fw-bold mb-2">
            Welcome,{' '}
            <span style={{ color: '#f9a8d4' }}>
              {correspondentName}
            </span>
            !
          </h2>

          <p
            className="mb-0"
            style={{
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 650,
              lineHeight: 1.7,
            }}
          >
            Track your submitted news, publishing performance, article
            readership and recent publishing activity from one place.
          </p>
        </div>

        <div
          className="position-absolute"
          style={{
            right: 35,
            top: -55,
            width: 190,
            height: 190,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
          }}
        />
        <div
          className="position-absolute"
          style={{
            right: 75,
            top: -15,
            width: 110,
            height: 110,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Statistics */}
      <CRow className="mb-3">
        {stats.map((item, index) => (
          <CCol sm={6} xl={3} key={index} className="mb-3">
            <div
              className="h-100 position-relative"
              style={{
                ...cardStyle,
                background: item.gradient,
                color: '#fff',
                padding: 20,
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div style={{ minWidth: 0 }}>
                  <div
                    className="small fw-semibold mb-2"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
                  >
                    {item.title}
                  </div>

                  <h2 className="fw-bold mb-1" style={{ color: '#fff' }}>
                    {formatNumber(item.count)}
                  </h2>

                  <div
                    className="small"
                    style={{ color: 'rgba(255,255,255,0.78)' }}
                  >
                    {item.detail}
                  </div>
                </div>

                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.19)',
                    border: '1px solid rgba(255,255,255,0.18)',
                  }}
                >
                  <CIcon icon={item.icon} size="xl" />
                </div>
              </div>

              <div
                className="mt-4"
                style={{
                  height: 5,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(
                      (item.count / maxStat) * 100,
                      item.count > 0 ? 5 : 0,
                    )}%`,
                    height: '100%',
                    background: '#fff',
                    borderRadius: 10,
                  }}
                />
              </div>

              <div
                className="position-absolute small fw-semibold"
                style={{
                  top: 13,
                  right: 14,
                  fontSize: 9,
                  letterSpacing: 1,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                LIVE
              </div>
            </div>
          </CCol>
        ))}
      </CRow>

      {/* Charts */}
      <CRow className="mb-3">
        <CCol lg={6} className="mb-3">
          <CCard className="h-100 border-0" style={panelStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilChartLine,
                'Most Viewed News',
                'Article views in the last 24 hours',
                COLORS.blue,
              )}

              {mostViewed.length > 0 ? (
                <CChartBar
                  data={{
                    labels: mostViewed.map((item) =>
                      getTitle(item).length > 25
                        ? `${getTitle(item).slice(0, 25)}...`
                        : getTitle(item),
                    ),
                    datasets: [
                      {
                        label: 'Views',
                        backgroundColor: '#2563eb',
                        borderRadius: 6,
                        data: mostViewed.map((item) =>
                          Number(item.views ?? item.recentViews ?? 0),
                        ),
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: { color: '#edf1f7' },
                      },
                      y: {
                        grid: { display: false },
                      },
                    },
                  }}
                  style={{ height: '300px' }}
                />
              ) : (
                <div className="text-center py-5 text-body-secondary">
                  No views data available.
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6} className="mb-3">
          <CCard className="h-100 border-0" style={panelStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilCalendar,
                'Weekly Publishing Activity',
                'Your publishing performance over time',
                COLORS.green,
              )}

              {activity.length > 0 ? (
                <CChartLine
                  data={{
                    labels: activity.map(
                      (item) => item.date || item.label || '-',
                    ),
                    datasets: [
                      {
                        label: 'Published News',
                        backgroundColor: 'rgba(5,150,105,0.12)',
                        borderColor: COLORS.green,
                        pointBackgroundColor: COLORS.green,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        data: activity.map((item) =>
                          Number(item.count || 0),
                        ),
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                        grid: { color: '#edf1f7' },
                      },
                    },
                  }}
                  style={{ height: '300px' }}
                />
              ) : (
                <div className="text-center py-5 text-body-secondary">
                  No publishing activity available.
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent News */}
      <CCard className="border-0 mb-4" style={panelStyle}>
        <CCardBody className="p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            {panelHeading(
              cilNewspaper,
              'My Recent News',
              'Latest news submitted by you',
              COLORS.purple,
            )}

            <CBadge
              color="primary"
              className="px-3 py-2"
              style={{ borderRadius: 20 }}
            >
              {recentNews.length} Records
            </CBadge>
          </div>

          {recentNews.length > 0 ? (
            <div className="table-responsive">
              <CTable hover align="middle" className="mb-0">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell
                      className="py-3"
                      style={{ color: '#64748b', background: '#f8fafc' }}
                    >
                      NEWS TITLE
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="py-3"
                      style={{ color: '#64748b', background: '#f8fafc' }}
                    >
                      STATUS
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="py-3"
                      style={{ color: '#64748b', background: '#f8fafc' }}
                    >
                      VIEWS
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="py-3"
                      style={{ color: '#64748b', background: '#f8fafc' }}
                    >
                      DATE
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentNews.map((news, index) => {
                    const status = getNewsStatus(news)
                    const date = getValidDate(news.createdAt)

                    return (
                      <CTableRow key={news._id || index}>
                        <CTableDataCell className="py-3">
                          <div
                            className="fw-semibold"
                            style={{
                              color: '#172033',
                              minWidth: 180,
                              maxWidth: 420,
                              whiteSpace: 'normal',
                              lineHeight: 1.5,
                            }}
                          >
                            {getTitle(news)}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge
                            color={status.color}
                            className="px-3 py-2"
                            style={{ borderRadius: 20 }}
                          >
                            {status.label}
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell>
                          <span className="fw-semibold">
                            {formatNumber(news.views)}
                          </span>
                        </CTableDataCell>

                        <CTableDataCell>
                          <span className="text-body-secondary small">
                            {date
                              ? date.toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            <div className="text-center py-5 text-body-secondary">
              <CIcon
                icon={cilNewspaper}
                size="3xl"
                className="mb-3 opacity-50"
              />
              <p className="mb-0">No recent news found.</p>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default CorrespondenceDashboard
