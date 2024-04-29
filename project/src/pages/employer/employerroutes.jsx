import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployerDashboard from './employerdashboard';
import EmployerLogin from './employerlogin';
import EmployerSignup from './employersignup';
import PostJobs from './postjobs';
import ReviewApplications from './reviewapplications';
import ManageInterviews from './manageinterviews';

const EmployerRoutes = () => {
  return (
    <Routes>
      <Route path="employerdashboard" element={<EmployerDashboard />} />
      <Route path="employerlogin" element={<EmployerLogin />} />
      <Route path="employersignup" element={<EmployerSignup />} />
      <Route path="postjobs" element={<PostJobs />} />
      <Route path="reviewapplications" element={<ReviewApplications />} />
      <Route path="manageinterviews" element={<ManageInterviews />} />
    </Routes>
  );
};

export default EmployerRoutes;