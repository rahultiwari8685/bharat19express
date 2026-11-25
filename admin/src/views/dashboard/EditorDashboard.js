
import React from 'react'
import RoleDashboard from './RoleDashboard'

const EditorDashboard = () => {
  const links = [
    {
      name: 'Add News',
      description: 'Create and submit news articles.',
      to: '/news',
    },
    {
      name: 'Published News',
      description: 'View published news articles.',
      to: '/PublishedNews',
    },
    {
      name: 'Draft News',
      description: 'Continue working on draft articles.',
      to: '/DraftNews',
    },
    {
      name: 'Scheduled News',
      description: 'View scheduled articles.',
      to: '/ScheduleNews',
    },
    {
      name: 'E-Paper',
      description: 'Manage and view E-Paper.',
      to: '/magazine',
    },
    {
      name: 'My Profile',
      description: 'View and update your profile.',
      to: '/Profile',
    },
  ]

  return (
    <RoleDashboard
      title="Editor"
      description="Manage news content, drafts and publishing activities."
      links={links}
    />
  )
}

export default EditorDashboard
