import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../components/interviewer';
import { Briefcase, Users, Calendar, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeCandidates: 0,
    scheduledInterviews: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalJobs: 24,
        activeCandidates: 156,
        scheduledInterviews: 8,
        pendingApprovals: 3,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-xl text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening with your recruitment.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalJobs}</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Active Candidates</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.activeCandidates}</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Scheduled Interviews</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.scheduledInterviews}</p>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Today: 3 interviews
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pending Approvals</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.pendingApprovals}</p>
                  <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Needs attention
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
              <h2 className="text-lg font-semibold text-white">Recent Job Postings</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {[
                  { title: 'Senior Software Engineer', department: 'Engineering', status: 'Active', applicants: 45 },
                  { title: 'Product Manager', department: 'Product', status: 'Active', applicants: 32 },
                  { title: 'UX Designer', department: 'Design', status: 'Review', applicants: 18 },
                  { title: 'Data Analyst', department: 'Analytics', status: 'Active', applicants: 27 },
                ].map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <h3 className="font-medium text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-600">{job.department}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">{job.applicants} applicants</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
              <h2 className="text-lg font-semibold text-white">Upcoming Interviews</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {[
                  { candidate: 'John Smith', role: 'Senior Developer', time: '10:00 AM', date: 'Today' },
                  { candidate: 'Sarah Johnson', role: 'Product Manager', time: '2:00 PM', date: 'Today' },
                  { candidate: 'Mike Brown', role: 'UX Designer', time: '11:00 AM', date: 'Tomorrow' },
                  { candidate: 'Emily Davis', role: 'Data Analyst', time: '3:00 PM', date: 'Tomorrow' },
                ].map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{interview.candidate}</h3>
                        <p className="text-sm text-slate-600">{interview.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{interview.time}</p>
                      <p className="text-xs text-slate-500">{interview.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 mt-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Create New Job</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">View Candidates</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Schedule Interview</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
