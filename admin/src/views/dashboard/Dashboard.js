
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
    loginData?.role ||
    loginData?.user?.role ||
    ''
  ).trim().toLowerCase()

  // TEMPORARY DEBUG: Check actual login role
  console.log('LOGIN DATA:', loginData)
  console.log('USER ROLE:', role)

  switch (role) {
    case 'admin':
      return <AdminDashboard />

    case 'editor':
      return <EditorDashboard />

    case 'correspondence':
      return <CorrespondenceDashboard />

    case 'subscriber':
      return <SubscriberDashboard />

    default:
      return <DefaultDashboard />
  }
}

export default Dashboard
