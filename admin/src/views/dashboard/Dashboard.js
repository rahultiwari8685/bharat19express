// import React, { useEffect, useState } from 'react'
// import { CCard, CCardBody, CCol, CRow, CProgress, CProgressBar } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilPeople, cilUser, cilUserX, cilMoney, cilCalendar } from '@coreui/icons'
// import setting from '../../setting.json'
// import secureLocalStorage from 'react-secure-storage'

// const Dashboard = () => {
//   const [stats, setStats] = useState([
//     {
//       title: 'Total News',
//       count: 0,
//       goal: 100,
//       icon: cilPeople,
//       gradient: 'linear-gradient(135deg, #0d6efd 0%, #67b0fd 100%)',
//     },
//     {
//       title: 'Draft News',
//       count: 0,
//       goal: 50,
//       icon: cilUser,
//       gradient: 'linear-gradient(135deg, #dc3545 0%, #ff6b81 100%)',
//     },
//     {
//       title: 'Category',
//       count: 0,
//       goal: 40,
//       icon: cilUserX,
//       gradient: 'linear-gradient(135deg, #198754 0%, #66d9a4 100%)',
//     },
//     {
//       title: 'Deleted News',
//       count: 0,
//       goal: 30,
//       icon: cilMoney,
//       gradient: 'linear-gradient(135deg, #fd7e14 0%, #ffae52 100%)',
//     },
//   ])

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

//         // ✅ Fetch News
//         const newsRes = await fetch(setting.api + '/api/news/getAllNews', {
//           headers: {
//             Authorization: 'Bearer ' + token,
//           },
//         })
//         const newsData = await newsRes.json()

//         const allNews = newsData.data || []

//         // ✅ Calculate counts
//         const totalNews = allNews.length
//         const draftNews = allNews.filter((n) => n.type === 2).length
//         const deletedNews = allNews.filter((n) => n.isDeleted === true).length

//         // ✅ Fetch Categories
//         const catRes = await fetch(setting.api + '/api/categories/getAllCategory')
//         const catData = await catRes.json()

//         const totalCategory = catData.data?.length || 0

//         // ✅ Update Stats
//         setStats((prev) => [
//           { ...prev[0], count: totalNews },
//           { ...prev[1], count: draftNews },
//           { ...prev[2], count: totalCategory },
//           { ...prev[3], count: deletedNews },
//         ])
//       } catch (error) {
//         console.error('Dashboard Error:', error)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   const maxCount = Math.max(...stats.map((s) => s.count), 1)

//   return (
//     <div className="p-4">
//       <CRow className="g-4">
//         {stats.map((item, index) => {
//           const progress = Math.min((item.count / maxCount) * 100, 100)

//           return (
//             <CCol md={6} lg={3} sm={12} key={index}>
//               <CCard
//                 className="text-white shadow border-0 h-100"
//                 style={{
//                   background: item.gradient,
//                   borderRadius: '1rem',
//                 }}
//               >
//                 <CCardBody className="d-flex flex-column justify-content-between p-4">
//                   <div className="d-flex align-items-center mb-3">
//                     <div
//                       className="icon-wrapper bg-white text-primary d-flex align-items-center justify-content-center rounded-circle me-3"
//                       style={{ width: '50px', height: '50px' }}
//                     >
//                       <CIcon icon={item.icon} size="lg" />
//                     </div>
//                     <div>
//                       <h5 className="fw-bold mb-1">{item.title}</h5>
//                       <small>{item.count}</small>
//                     </div>
//                   </div>

//                   <CProgress
//                     className="rounded-pill"
//                     style={{
//                       height: '10px',
//                       backgroundColor: 'rgba(255,255,255,0.3)',
//                     }}
//                   >
//                     <CProgressBar
//                       value={progress}
//                       style={{
//                         backgroundColor: '#fff',
//                         transition: 'width 0.6s ease',
//                       }}
//                     />
//                   </CProgress>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           )
//         })}
//       </CRow>
//     </div>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from 'react'
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
}

const Dashboard = () => {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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

        setNews(Array.isArray(newsResult.data) ? newsResult.data : [])
        setCategories(Array.isArray(categoryResult.data) ? categoryResult.data : [])
      } catch (err) {
        console.error('Dashboard Error:', err)
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Adjust these field names to match your backend schema.
  const getViews = (item) => Number(item.views ?? item.viewCount ?? item.totalViews ?? 0)

  const getAuthorName = (item) => {
    if (item.author && typeof item.author === 'object') {
      return item.author.name || item.author.username || 'Unknown Author'
    }

    return item.authorName || 'Unknown Author'
  }

  const getTitle = (item) => item.title || item.heading || item.newsTitle || 'Untitled News'

  const publishedNews = news.filter((item) => Number(item.type) === 1 && item.isDeleted !== true)

  const draftNews = news.filter((item) => Number(item.type) === 2 && item.isDeleted !== true)

  const deletedNews = news.filter((item) => item.isDeleted === true)

  const mostViewedNews = [...publishedNews].sort((a, b) => getViews(b) - getViews(a)).slice(0, 7)

  const authorCounts = publishedNews.reduce((result, item) => {
    const author = getAuthorName(item)
    result[author] = (result[author] || 0) + 1
    return result
  }, {})

  const mostActiveAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)

  const totalViews = publishedNews.reduce((sum, item) => sum + getViews(item), 0)

  const stats = [
    {
      title: 'Total News',
      count: news.filter((item) => item.isDeleted !== true).length,
      icon: cilNewspaper,
      color: COLORS.blue,
      detail: 'All active news',
    },
    {
      title: 'Published News',
      count: publishedNews.length,
      icon: cilEye,
      color: COLORS.green,
      detail: 'Live articles',
    },
    {
      title: 'Draft News',
      count: draftNews.length,
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
      count: deletedNews.length,
      icon: cilTrash,
      color: COLORS.red,
      detail: 'Items marked deleted',
    },
    {
      title: 'Total Views',
      count: totalViews,
      icon: cilEye,
      color: '#0891b2',
      detail: 'Published news views',
    },
  ]

  const formatNumber = (number) => Number(number || 0).toLocaleString('en-IN')

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(148,163,184,0.15)' },
      },
      y: {
        grid: { display: false },
      },
    },
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <CSpinner color="primary" />
        <span className="ms-2">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="p-3 p-md-4" style={{ background: '#f5f7fb', minHeight: '100vh' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold mb-1">News Dashboard</h3>
          <p className="text-body-secondary mb-0">
            Bharat 19 Express · Content performance and analytics
          </p>
        </div>

        <CBadge color="success" className="px-3 py-2">
          Live data
        </CBadge>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <CRow className="g-3 mb-4">
        {stats.map((item) => (
          <CCol xs={12} sm={6} xl={4} key={item.title}>
            <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
              <CCardBody className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-body-secondary small mb-2">{item.title}</div>
                    <h3 className="fw-bold mb-1">{formatNumber(item.count)}</h3>
                    <small className="text-body-secondary">{item.detail}</small>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 52,
                      height: 52,
                      background: `${item.color}18`,
                      color: item.color,
                    }}
                  >
                    <CIcon icon={item.icon} size="xl" />
                  </div>
                </div>

                <CProgress className="mt-3" style={{ height: 5 }}>
                  <CProgressBar
                    value={
                      item.count > 0
                        ? Math.min(
                            (item.count / Math.max(...stats.map((stat) => stat.count), 1)) * 100,
                            100,
                          )
                        : 0
                    }
                    style={{ backgroundColor: item.color }}
                  />
                </CProgress>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow className="g-4 mb-4">
        <CCol xs={12} xl={7}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
            <CCardBody className="p-4">
              <h5 className="fw-bold mb-1">Most Viewed News</h5>
              <p className="text-body-secondary small mb-4">
                Top published articles ranked by view count
              </p>

              {mostViewedNews.length > 0 && mostViewedNews.some((item) => getViews(item) > 0) ? (
                <div style={{ height: 320 }}>
                  <CChartBar
                    data={{
                      labels: mostViewedNews.map((item) => {
                        const title = getTitle(item)
                        return title.length > 38 ? `${title.slice(0, 38)}…` : title
                      }),
                      datasets: [
                        {
                          label: 'Views',
                          backgroundColor: COLORS.blue,
                          borderRadius: 6,
                          data: mostViewedNews.map(getViews),
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
                  <p className="mb-1">No view analytics available</p>
                  <small>Add a view-count field and track views in the backend.</small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} xl={5}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
            <CCardBody className="p-4">
              <h5 className="fw-bold mb-1">Most Published Authors</h5>
              <p className="text-body-secondary small mb-4">
                Authors ranked by published article count
              </p>

              {mostActiveAuthors.length > 0 ? (
                <>
                  <div style={{ height: 280 }}>
                    <CChartBar
                      data={{
                        labels: mostActiveAuthors.map(([name]) => name),
                        datasets: [
                          {
                            label: 'Published articles',
                            backgroundColor: COLORS.green,
                            borderRadius: 6,
                            data: mostActiveAuthors.map(([, count]) => count),
                            barThickness: 22,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>

                  <div className="mt-3">
                    {mostActiveAuthors.slice(0, 3).map(([name, count], index) => (
                      <div
                        key={name}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      >
                        <span>
                          <span className="text-body-secondary me-2">#{index + 1}</span>
                          {name}
                        </span>
                        <strong>{count} posts</strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-body-secondary py-5">
                  <CIcon icon={cilUser} size="3xl" className="mb-3" />
                  <p>No published author data available.</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-4">
        <CCol xs={12} xl={7}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <CCardBody className="p-4">
              <h5 className="fw-bold mb-1">News Publishing Activity</h5>
              <p className="text-body-secondary small mb-4">
                Published articles created over the last seven days
              </p>

              {(() => {
                const days = Array.from({ length: 7 }, (_, index) => {
                  const date = new Date()
                  date.setHours(0, 0, 0, 0)
                  date.setDate(date.getDate() - (6 - index))
                  return date
                })

                const dailyCounts = days.map(
                  (day) =>
                    publishedNews.filter((item) => {
                      if (!item.createdAt) return false
                      const created = new Date(item.createdAt)
                      return (
                        created.getFullYear() === day.getFullYear() &&
                        created.getMonth() === day.getMonth() &&
                        created.getDate() === day.getDate()
                      )
                    }).length,
                )

                return (
                  <div style={{ height: 260 }}>
                    <CChartLine
                      data={{
                        labels: days.map((day) =>
                          day.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          }),
                        ),
                        datasets: [
                          {
                            label: 'Published news',
                            data: dailyCounts,
                            borderColor: COLORS.blue,
                            backgroundColor: 'rgba(37,99,235,0.12)',
                            fill: true,
                            tension: 0.35,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                      }}
                    />
                  </div>
                )
              })()}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} xl={5}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <CCardBody className="p-4">
              <h5 className="fw-bold mb-3">Recent News</h5>

              {[...news]
                .filter((item) => item.isDeleted !== true)
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, 6)
                .map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-start gap-3 py-3 border-bottom"
                  >
                    <div className="min-w-0">
                      <div className="fw-semibold text-truncate">{getTitle(item)}</div>
                      <small className="text-body-secondary">
                        {getAuthorName(item)} ·{' '}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('en-IN')
                          : 'Date unavailable'}
                      </small>
                    </div>

                    <CBadge color={Number(item.type) === 1 ? 'success' : 'warning'}>
                      {Number(item.type) === 1 ? 'Published' : 'Draft'}
                    </CBadge>
                  </div>
                ))}

              {news.length === 0 && <p className="text-body-secondary mb-0">No news found.</p>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
