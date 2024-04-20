// Sidebar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import SidebarConfig from './sidebarconfig'
import './sidebar.css'
import Container from 'react-bootstrap/Container'

const Sidebar = ({ role }) => {
  // Add username prop here
  const location = useLocation()
  const sidebarConfig = SidebarConfig[role]

  return (
    <div className='sidebar'>
      {sidebarConfig.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className={location.pathname === item.link ? 'active' : ''}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default Sidebar
