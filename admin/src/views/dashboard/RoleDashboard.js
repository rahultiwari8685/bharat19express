
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilNewspaper,
  cilClock,
  cilChart,
} from '@coreui/icons'

import setting from '../../setting.json'

const RoleDashboard = ({ title = 'Dashboard', description = 'Manage your activity and performance.' }) => {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState({})
  
  const loginInfo = secureLocalStorage.getItem('logininfo')

  let loginData = {}

  try {
    loginData =
      typeof loginInfo === 'string'
        ? JSON.parse(loginInfo)
        : loginInfo || {}
  } catch (error) {
    console.error('Login info error:', error)
  }

  const userName =
    loginData?.user?.name ||
    loginData?.user?.fullName ||
    loginData?.name ||
    loginData?.fullName ||
    loginData?.username ||
    loginData?.userName ||
    'User'

  const role = String(
    loginData?.user?.role ??
    loginData?.role ??
    loginData?.user?.roleId ??
    '',
  )

  const token = loginData?.token

  const dashboardEndpoints = {
    1: '/admin',
    2: '/editor',
    3: '/correspondence',
    4: '/subscriber',
  }

  const endpoint = dashboardEndpoints[role]

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token || !endpoint) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${setting.api}/api/dashboard${endpoint}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        const result = await response.json()

        if (response.ok && result.status) {
          setDashboard(result.data || {})
        } else {
          console.error('Dashboard API error:', result.message)
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [token, endpoint])

  const stats = [
    {
      title: 'Total Published',
      value: dashboard.totalPublished ?? dashboard.publishedNews ?? 0,
      icon: cilNewspaper,
      color: 'primary',
    },
    {
      title: 'Published Today',
      value: dashboard.todayPublished ?? 0,
      icon: cilFolderOpen,
      color: 'success',
    },
    {
      title: 'Total Drafts',
      value: dashboard.drafts ?? dashboard.draftNews ?? 0,
      icon: cilPencil,
      color: 'warning',
    },
    {
      title: 'Total Views',
      value: dashboard.totalViews ?? 0,
      icon: cilUser,
      color: 'info',
    },
  ]

  const mostViewed = dashboard.mostViewed || []
  const activity = dashboard.publishingActivity || []
  const recentNews = dashboard.recentNews || []

  const isSubscriber = role === '4'

  const subscriberStats = [
 {
  title: 'Total News Viewed',
  value: dashboard.totalViews,
  icon: cilNewspaper,
  color: 'primary',
},
    {
      title: "Today's Views",
      value: dashboard.todayViews ?? 0,
      icon: cilFolderOpen,
      color: 'success',
    },
    {
      title: 'Recently Read',
      value: recentNews.length,
      icon: cilPencil,
      color: 'warning',
    },
    {
      title: 'Popular News',
      value: mostViewed.length,
      icon: cilUser,
      color: 'info',
    },
  ]

  const displayStats = isSubscriber ? subscriberStats : stats

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Welcome Banner */}
      <div
        className="p-4 mb-4"
        style={{
          borderRadius: 18,
          color: '#fff',
          background:
            'linear-gradient(115deg, #101b3d, #172554 60%, #312e81)',
          boxShadow: '0 12px 28px rgba(30,64,175,0.16)',
        }}
      >
        <div className="small mb-2" style={{ color: '#bfdbfe' }}>
          BHARAT 19 EXPRESS · {title.toUpperCase()}
        </div>

        <h2 className="fw-bold mb-2">
          Welcome Back,{' '}
          <span style={{ color: '#fb7185' }}>{userName}!</span>
        </h2>

        <p className="mb-0" style={{ color: '#dbeafe' }}>
          {description}
        </p>
      </div>

      {/* Statistics */}
      <CRow className="mb-4">
        {displayStats.map((item, index) => (
          <CCol sm={6} xl={3} key={index} className="mb-3">
            <CCard className="h-100 border-0 shadow-sm">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-body-secondary small">
                      {item.title}
                    </div>
                    <h3 className="mt-2 mb-0 fw-semibold">
                      {Number(item.value || 0).toLocaleString('en-IN')}
                    </h3>
                  </div>

                  <div className={`bg-${item.color} bg-opacity-10 rounded p-3`}>
                    <CIcon
                      icon={item.icon}
                      size="xl"
                      className={`text-${item.color}`}
                    />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Popular / Most Viewed News */}
      <CRow className="mb-4">
        <CCol lg={isSubscriber ? 12 : 6} className="mb-3">
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody>
              <h5 className="mb-3">
                {isSubscriber ? 'Popular News' : 'Most Viewed News (Last 24 Hours)'}
              </h5>

              {mostViewed.length > 0 ? (
                <CChartBar
                  data={{
                    labels: mostViewed.map(
                      (item) => item.title || 'Untitled',
                    ),
                    datasets: [
                      {
                        label: 'Views',
                        backgroundColor: '#321fdb',
                        data: mostViewed.map((item) =>
                          Number(item.views || 0),
                        ),
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { beginAtZero: true },
                    },
                  }}
                  style={{ height: 300 }}
                />
              ) : (
                <p className="text-body-secondary text-center py-5">
                  No views data available.
                </p>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Publishing Activity */}
        {!isSubscriber && (
          <CCol lg={6} className="mb-3">
            <CCard className="h-100 border-0 shadow-sm">
              <CCardBody>
                <h5 className="mb-3">Weekly Publishing Activity</h5>

                {activity.length > 0 ? (
                  <CChartLine
                    data={{
                      labels: activity.map((item) => item.date),
                      datasets: [
                        {
                          label: 'Published News',
                          backgroundColor: 'rgba(46, 184, 92, 0.15)',
                          borderColor: '#2eb85c',
                          pointBackgroundColor: '#2eb85c',
                          data: activity.map((item) =>
                            Number(item.count || 0),
                          ),
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { precision: 0 },
                        },
                      },
                    }}
                    style={{ height: 300 }}
                  />
                ) : (
                  <p className="text-body-secondary text-center py-5">
                    No publishing activity available.
                  </p>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        )}
      </CRow>

      {/* Recent News / Reading History */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <h5 className="mb-3">
            {isSubscriber ? 'Recently Viewed News' : 'My Recent News'}
          </h5>

          {recentNews.length > 0 ? (
            <div className="table-responsive">
              <CTable hover align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>News Title</CTableHeaderCell>
                    <CTableHeaderCell>
                      {isSubscriber ? 'Category' : 'Status'}
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      {isSubscriber ? 'Viewed At' : 'Views'}
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      {isSubscriber ? ' ' : 'Date'}
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentNews.map((news, index) => (
                    <CTableRow key={news._id || index}>
                      <CTableDataCell>
                        <strong>{news.title || 'Untitled'}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        {isSubscriber ? (
                          news.categoryName || '-'
                        ) : (
                          <CBadge
                            color={
                              Number(news.newsType) === 1
                                ? 'success'
                                : Number(news.newsType) === 2
                                  ? 'warning'
                                  : 'info'
                            }
                          >
                            {Number(news.newsType) === 1
                              ? 'Published'
                              : Number(news.newsType) === 2
                                ? 'Draft'
                                : Number(news.newsType) === 3
                                  ? 'Scheduled'
                                  : 'Unknown'}
                          </CBadge>
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {isSubscriber
                          ? news.viewedAt
                            ? new Date(news.viewedAt).toLocaleString('en-IN')
                            : '-'
                          : Number(news.views || 0).toLocaleString('en-IN')}
                      </CTableDataCell>

                      <CTableDataCell>
                        {isSubscriber
                          ? '-'
                          : news.createdAt
                            ? new Date(news.createdAt).toLocaleDateString('en-IN')
                            : '-'}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            <p className="text-body-secondary text-center py-4 mb-0">
              {isSubscriber
                ? 'You have not viewed any news yet.'
                : 'No recent news found.'}
            </p>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default RoleDashboard
