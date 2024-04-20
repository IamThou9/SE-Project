const SidebarConfig = {
  admin: [
    { label: 'Dashboard', link: '/admin/adminDashboard' },
    { label: 'Manage Users', link: '/admin/users' },
    { label: 'Manage Events', link: '/admin/events' },
    { label: 'View Reports', link: '/admin/reports' },
    { label: 'Logout', link: '/logout' },
  ],
  student: [
    { label: 'Dashboard', link: '/student/student_dashboard' },
    { label: 'Edit Profile', link: '/student/student_profile' },
    { label: 'Resources', link: '/student/student_resources' },
    { label: 'Job Listings', link: '/student/jobs_listing' },
    { label: 'Status', link: '/student/job_status' },
    { label: 'Discussion Board', link: '/student/discussion_board' },
    { label: 'Logout', link: '/logout' },
  ],
  employer: [
    { label: 'Dashboard', link: '/employer/employerdashboard' },
    { label: 'Post Jobs', link: '/employer/postjobs' },
    { label: 'Review Applications', link: '/employer/reviewapplications' },
    { label: 'Manage Interviews', link: '/employer/manageinterviews' },
    { label: 'Logout', link: '/logout' },
  ]
};

export default SidebarConfig;