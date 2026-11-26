
import React, { useEffect, useState } from 'react'
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
  cilPencil,
  cilFolderOpen,
  cilUser,
} from '@coreui/icons'

import secureLocalStorage from 'react-secure-storage'
import setting from '../../setting.json'

const CorrespondenceDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState({
    totalPublished: 0,
    todayPublished: 0,
    drafts: 0,
    totalViews: 0,
    mostViewed: [],
    publishingActivity: [],
    recentNews: [],
  })

  const loginData = secureLocalStorage.getItem('logininfo')
  const token = loginData?.token

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
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

        if (response.ok && result.status) {
          setDashboard((prev) => ({
            ...prev,
            ...result.data,
          }))
        } else {
          console.error('Dashboard API error:', result.message)
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboard()
    } else {
      setLoading(false)
    }
  }, [token])

  const stats = [
    {
      title: 'Total Published',
      value: dashboard.totalPublished,
      icon: cilNewspaper,
      color: 'primary',
    },
    {
      title: 'Published Today',
      value: dashboard.todayPublished,
      icon: cilFolderOpen,
      color: 'success',
    },
    {
      title: 'Total Drafts',
      value: dashboard.drafts,
      icon: cilPencil,
      color: 'warning',
    },
    {
      title: 'Total Views',
      value: dashboard.totalViews,
      icon: cilUser,
      color: 'info',
    },
  ]

  const mostViewed = dashboard.mostViewed || []
  const activity = dashboard.publishingActivity || []
  const recentNews = dashboard.recentNews || []

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Welcome Section */}
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardBody className="p-4">
          <h3 className="mb-2">
            Welcome, {loginData?.user?.name || 'Correspondent'}!
          </h3>
          <p className="text-body-secondary mb-0">
            Track your submitted news, publishing performance, and readership.
          </p>
        </CCardBody>
      </CCard>

      {/* Statistics */}
      <CRow className="mb-4">
        {stats.map((item, index) => (
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

                  <div
                    className={`bg-${item.color} bg-opacity-10 rounded p-3`}
                  >
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

      {/* Charts */}
      <CRow className="mb-4">
        <CCol lg={6} className="mb-3">
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody>
              <h5 className="mb-3">Most Viewed News (Last 24 Hours)</h5>

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
                  style={{ height: '300px' }}
                />
              ) : (
                <p className="text-body-secondary text-center py-5">
                  No views data available.
                </p>
              )}
            </CCardBody>
          </CCard>
        </CCol>

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
                  style={{ height: '300px' }}
                />
              ) : (
                <p className="text-body-secondary text-center py-5">
                  No publishing activity available.
                </p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent News */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <h5 className="mb-3">My Recent News</h5>

          {recentNews.length > 0 ? (
            <div className="table-responsive">
              <CTable hover align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>News Title</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Views</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentNews.map((news, index) => (
                    <CTableRow key={news._id || index}>
                      <CTableDataCell>
                        <strong>{news.title || 'Untitled'}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
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
                      </CTableDataCell>

                      <CTableDataCell>
                        {Number(news.views || 0).toLocaleString('en-IN')}
                      </CTableDataCell>

                      <CTableDataCell>
                        {news.createdAt
                          ? new Date(news.createdAt).toLocaleDateString(
                              'en-IN',
                            )
                          : '-'}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            <p className="text-body-secondary text-center py-4 mb-0">
              No recent news found.
            </p>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default CorrespondenceDashboard
