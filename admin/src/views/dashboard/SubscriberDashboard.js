
import React from 'react'
import RoleDashboard from './RoleDashboard'

const SubscriberDashboard = () => {
  const links = [
    {
      name: 'Published News',
      description: 'View published news articles.',
      to: '/PublishedNews',
    },
    {
      name: 'Draft News',
      description: 'View available draft news.',
      to: '/DraftNews',
    },
    {
      name: 'Scheduled News',
      description: 'View scheduled articles.',
      to: '/ScheduleNews',
    },
    {
      name: 'My Profile',
      description: 'View and update your profile.',
      to: '/Profile',
    },
  ]

  return (
    <RoleDashboard
      title="Subscriber"
      description="Access your available news and account information."
      links={links}
    />
  )
}

export default SubscriberDashboard
