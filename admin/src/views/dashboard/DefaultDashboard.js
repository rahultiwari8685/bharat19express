
import React from 'react'
import RoleDashboard from './RoleDashboard'

const DefaultDashboard = () => (
  <RoleDashboard
    title="User Dashboard"
    description="Welcome to the Bharat 19 Express admin panel."
    links={[
      {
        name: 'My Profile',
        description: 'View your account information.',
        to: '/Profile',
      },
    ]}
  />
)

export default DefaultDashboard
