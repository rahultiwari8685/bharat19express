
import React from 'react'
import RoleDashboard from './RoleDashboard'

const CorrespondenceDashboard = () => {
  const links = [
    {
      name: 'Add News',
      description: 'Create and submit news articles.',
      to: '/news',
    },
    {
      name: 'Published News',
      description: 'View published articles.',
      to: '/PublishedNews',
    },
    {
      name: 'Draft News',
      description: 'Manage your draft articles.',
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
      to: '/profile',
    },
  ]

  return (
    <RoleDashboard
      title="Correspondence"
      description="Manage your news submissions and publishing work."
      links={links}
    />
  )
}

export default CorrespondenceDashboard
