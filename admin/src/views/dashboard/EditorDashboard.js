
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
  CBadge,
  CButton,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import {
  cilNewspaper,
  cilPencil,
  cilEye,
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
  cyan: 'linear-gradient(135deg, #0891b2, #06b6d4)',
}

const cardStyle = {
  border: '1px solid rgba(226,232,240,0.8)',
  borderRadius: 12,
  overflow: 'hidden',
  minWidth: 0,
  boxShadow: '0 5px 20px rgba(15,23,42,0.045)',
}

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('en-IN')

const getTitle = (item) =>
  item?.title || item?.heading || 'Untitled News'

const getAuthorName = (item) => {
  if (item?.author && typeof item.author === 'object') {
    return item.author.name || 'Unknown Author'
  }

  return item?.authorName || 'You'
}

const getValidDate = (value) => {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

const EditorDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalPublished: 0,
    todayPublished: 0,
    drafts: 0,
    totalViews: 0,
    mostViewed: [],
    publishingActivity: [],
    recentNews: [],
  })

  const [editorName, setEditorName] = useState('Editor')
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

      setEditorName(loginData?.user?.name || 'Editor')

      if (!token) {
        throw new Error('Login session not found. Please login again.')
      }

      const response = await fetch(
        `${setting.api}/api/dashboard/editor`,
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
          result.message || 'Unable to load editor dashboard.',
        )
      }

      setDashboard({
        totalPublished: Number(result.data?.totalPublished || 0),
        todayPublished: Number(result.data?.todayPublished || 0),
        drafts: Number(result.data?.drafts || 0),
        totalViews: Number(result.data?.totalViews || 0),
        mostViewed: Array.isArray(result.data?.mostViewed)
          ? result.data.mostViewed
          : [],
        publishingActivity: Array.isArray(
          result.data?.publishingActivity,
        )
          ? result.data.publishingActivity
          : [],
        recentNews: Array.isArray(result.data?.recentNews)
          ? result.data.recentNews
          : [],
      })
    } catch (err) {
      console.error('Editor Dashboard Error:', err)
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
      icon: cilEye,
      color: COLORS.purple,
      gradient: GRADIENTS.purple,
    },
  ]

  const maxStat = Math.max(
    ...stats.map((item) => item.count),
    1,
  )

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
        <p className="text-body-secondary small mb-0">
          {subtitle}
        </p>
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
          Loading editor dashboard...
        </span>
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
        boxSizing: 'border-box',
      }}
    >
      {/* Welcome Banner */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-4 mb-4"
        style={{
          borderRadius: 20,
          color: '#fff',
          background:
            'radial-gradient(circle at 85% 20%, #2563eb 0, transparent 30%), linear-gradient(115deg, #101b3d, #172554 60%, #312e81)',
          boxShadow: '0 12px 28px rgba(30,64,175,0.16)',
        }}
      >
        <div>
          <div className="small mb-2" style={{ color: '#bfdbfe' }}>
            BHARAT 19 EXPRESS · EDITOR PANEL
          </div>

          <h2 className="fw-bold mb-2">
            Welcome Back,{' '}
            <span style={{ color: '#fb7185' }}>
              {editorName}!
            </span>
          </h2>

          <p className="mb-0" style={{ color: '#dbeafe' }}>
            Track your articles, publishing activity and readership.
          </p>
        </div>

        <div
          className="d-flex align-items-center gap-3 p-3"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: 14,
          }}
        >
          <CIcon icon={cilCalendar} size="xl" />
          <div>
            <div className="fw-semibold">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <small style={{ color: '#bfdbfe' }}>
              Your daily overview
            </small>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>{error}</span>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={fetchDashboard}
          >
            Retry
          </CButton>
        </div>
      )}

      {/* Statistics Cards */}
      <CRow className="g-3 mb-4">
        {stats.map((item) => (
          <CCol xs={12} sm={6} xl={3} key={item.title}>
            <CCard
              className="h-100 border-0"
              style={{
                borderRadius: 12,
                color: '#fff',
                background: item.gradient,
                overflow: 'hidden',
                boxShadow: `0 8px 20px ${item.color}26`,
              }}
            >
              <CCardBody className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 42,
                      height: 42,
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <CIcon icon={item.icon} size="lg" />
                  </div>

                  <span
                    className="rounded-pill px-2 py-1 small fw-bold"
                    style={{
                      background: 'rgba(255,255,255,0.88)',
                      color: item.color,
                    }}
                  >
                    LIVE
                  </span>
                </div>

                <div className="small mb-1">
                  {item.title}
                </div>

                <h3 className="fw-bold mb-1">
                  {formatNumber(item.count)}
                </h3>

                <div className="small mb-3" style={{ opacity: 0.88 }}>
                  {item.detail}
                </div>

                <div
                  style={{
                    height: 5,
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: 20,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(
                        (item.count / maxStat) * 100,
                        100,
                      )}%`,
                      background: '#fff',
                      borderRadius: 20,
                    }}
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Most Viewed News */}
      <CRow className="g-4 mb-4">
        <CCol xs={12} xl={7}>
          <CCard className="h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilEye,
                'Most Viewed News',
                'Your top articles by views in the last 24 hours',
                COLORS.blue,
              )}

              {dashboard.mostViewed.length > 0 ? (
                <div style={{ height: 310, width: '100%' }}>
                  <CChartBar
                    data={{
                      labels: dashboard.mostViewed.map((item) => {
                        const title = getTitle(item)
                        return title.length > 34
                          ? `${title.slice(0, 34)}…`
                          : title
                      }),
                      datasets: [
                        {
                          label: 'Views in last 24 hours',
                          data: dashboard.mostViewed.map(
                            (item) => Number(item.recentViews || 0),
                          ),
                          backgroundColor: [
                            '#3B82F6',
                            '#06B6D4',
                            '#8B5CF6',
                            '#F59E0B',
                            '#64748B',
                            '#10B981',
                            '#F43F5E',
                          ],
                          borderRadius: 7,
                          barThickness: 23,
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
                          ticks: { precision: 0 },
                          grid: { color: '#edf1f7' },
                        },
                        y: {
                          grid: { display: false },
                          ticks: {
                            color: '#475569',
                            font: { size: 11 },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilEye} size="3xl" className="mb-3" />
                  <p className="fw-semibold mb-1">
                    No views recorded in the last 24 hours
                  </p>
                  <small>
                    Your articles will appear here when readers visit them.
                  </small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Publishing Activity */}
        <CCol xs={12} xl={5}>
          <CCard className="h-100" style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilChartLine,
                'Publishing Activity',
                'Your published articles over the last seven days',
                COLORS.green,
              )}

              {dashboard.publishingActivity.length > 0 ? (
                <div style={{ height: 310, width: '100%' }}>
                  <CChartLine
                    data={{
                      labels: dashboard.publishingActivity.map(
                        (item) => item.label,
                      ),
                      datasets: [
                        {
                          label: 'Published News',
                          data: dashboard.publishingActivity.map(
                            (item) => Number(item.count || 0),
                          ),
                          borderColor: COLORS.green,
                          backgroundColor: 'rgba(5,150,105,0.12)',
                          pointBackgroundColor: '#fff',
                          pointBorderColor: COLORS.green,
                          pointBorderWidth: 3,
                          pointRadius: 5,
                          fill: true,
                          tension: 0.4,
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
                          grid: { color: '#edf1f7' },
                        },
                        x: {
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  No publishing activity available.
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent News */}
      <CRow>
        <CCol xs={12}>
          <CCard style={cardStyle}>
            <CCardBody className="p-3 p-md-4">
              {panelHeading(
                cilNewspaper,
                'Recent News',
                'Your latest articles and their current status',
                COLORS.purple,
              )}

              {dashboard.recentNews.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>News Title</th>
                        <th>Views</th>
                        <th>Status</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboard.recentNews.map((item, index) => {
                        const created = getValidDate(item.createdAt)
                        const isPublished = Number(item.type) === 1
                        const isScheduled = Number(item.type) === 3

                        return (
                          <tr key={item._id || index}>
                            <td>{index + 1}</td>

                            <td style={{ minWidth: 220 }}>
                              <div
                                className="fw-semibold"
                                style={{
                                  color: '#1e293b',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {getTitle(item)}
                              </div>
                            </td>

                            <td>
                              {formatNumber(item.views)}
                            </td>

                            <td>
                              <CBadge
                                color={
                                  isPublished
                                    ? 'success'
                                    : isScheduled
                                      ? 'info'
                                      : 'warning'
                                }
                              >
                                {isPublished
                                  ? 'Published'
                                  : isScheduled
                                    ? 'Scheduled'
                                    : 'Draft'}
                              </CBadge>
                            </td>

                            <td>
                              {created
                                ? created.toLocaleDateString('en-IN')
                                : 'Date unavailable'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon
                    icon={cilNewspaper}
                    size="3xl"
                    className="mb-3"
                  />
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

export default EditorDashboard
