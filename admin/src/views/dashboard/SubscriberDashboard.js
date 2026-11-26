
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

import { CChartBar } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilNewspaper,
  cilEye,
  cilClock,
  cilChart,
} from '@coreui/icons'

import secureLocalStorage from 'react-secure-storage'
import setting from '../../setting.json'

const SubscriberDashboard = () => {
  const [loading, setLoading] = useState(true)

  const [dashboard, setDashboard] = useState({
    totalViews: 0,
    todayViews: 0,
    recentNews: [],
    mostViewed: [],
  })

  const loginData = secureLocalStorage.getItem('logininfo')
  const token = loginData?.token

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${setting.api}/api/dashboard/subscriber`,
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
          console.error('Subscriber dashboard error:', result.message)
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
      title: 'Total News Viewed',
      value: dashboard.totalViews,
      icon: cilEye,
      color: 'primary',
    },
    {
      title: "Today's Views",
      value: dashboard.todayViews,
      icon: cilChart,
      color: 'success',
    },
    {
      title: 'Recently Read',
      value: dashboard.recentNews?.length || 0,
      icon: cilClock,
      color: 'warning',
    },
    {
      title: 'Popular News',
      value: dashboard.mostViewed?.length || 0,
      icon: cilNewspaper,
      color: 'info',
    },
  ]

  const recentNews = dashboard.recentNews || []
  const mostViewed = dashboard.mostViewed || []

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Welcome */}
      <CCard className="mb-4 border-0 shadow-sm">
        <CCardBody className="p-4">
          <h3 className="mb-2">
            Welcome, {loginData?.user?.name || 'Subscriber'}!
          </h3>
          <p className="text-body-secondary mb-0">
            Explore your reading activity and discover popular news.
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

      {/* Most Viewed News */}
      <CRow className="mb-4">
        <CCol lg={12}>
          <CCard className="border-0 shadow-sm">
            <CCardBody>
              <h5 className="mb-3">Popular News</h5>

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
                <p className="text-body-secondary text-center py-5 mb-0">
                  No popular news available.
                </p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recently Viewed News */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <h5 className="mb-3">Recently Viewed News</h5>

          {recentNews.length > 0 ? (
            <div className="table-responsive">
              <CTable hover align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>News Title</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Viewed At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentNews.map((news, index) => (
                    <CTableRow key={news._id || index}>
                      <CTableDataCell>
                        <strong>{news.title || 'Untitled'}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        {news.categoryName || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {news.viewedAt
                          ? new Date(news.viewedAt).toLocaleString('en-IN')
                          : '-'}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ) : (
            <p className="text-body-secondary text-center py-4 mb-0">
              You have not viewed any news yet.
            </p>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default SubscriberDashboard
