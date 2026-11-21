
import React from 'react'
import secureLocalStorage from 'react-secure-storage'

import DefaultDashboard from './DefaultDashboard'
import AdminDashboard from './AdminDashboard'
import EditorDashboard from './EditorDashboard'
import CorrespondenceDashboard from './CorrespondenceDashboard'
import SubscriberDashboard from './SubscriberDashboard'

const Dashboard = () => {
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

  // Get numeric role ID from login information
  const role = String(
    loginData?.role || loginData?.user?.role || ''
  ).trim()

  console.log('Logged-in role ID:', role)

  // Display dashboard according to role ID
  switch (role) {
    case '1':
      return <AdminDashboard />

    case '2':
      return <EditorDashboard />

    case '3':
      return <CorrespondenceDashboard />

    case '4':
      return <SubscriberDashboard />

    default:
      return <DefaultDashboard />
  }
}

export default Dashboard
