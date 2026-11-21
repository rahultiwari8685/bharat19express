
import React from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
import secureLocalStorage from 'react-secure-storage'

const RoleDashboard = ({ title, description, links = [] }) => {
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
  loginData?.name ||
  loginData?.username ||
  loginData?.userName ||
  'User'

  return (
    <div className="container-fluid p-3 p-md-4">
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
          <span style={{ color: '#fb7185' }}>
            {userName}!
          </span>
        </h2>

        <p className="mb-0" style={{ color: '#dbeafe' }}>
          {description}
        </p>
      </div>

      <h5 className="fw-bold mb-3">Quick Access</h5>

      <CRow className="g-3">
        {links.map((item) => (
          <CCol xs={12} sm={6} lg={4} key={item.to}>
            <CCard className="h-100 border-0 shadow-sm">
              <CCardBody className="p-4">
                <h5 className="fw-bold">{item.name}</h5>

                <p className="text-body-secondary small">
                  {item.description}
                </p>

                <CButton
                  component={Link}
                  to={item.to}
                  color="primary"
                  size="sm"
                >
                  Open {item.name}
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  )
}

export default RoleDashboard
