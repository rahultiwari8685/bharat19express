
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

  const role = String(
    loginData?.role || loginData?.user?.role || ''
  ).trim()

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
