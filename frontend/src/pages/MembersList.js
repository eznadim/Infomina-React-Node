import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { memberService } from '../services/api';
import MemberModal from '../components/MemberModal';
import { useAuth } from '../contexts/AuthContext';

const MembersList = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchMembers();
    
    if (location.state?.openAddModal) {
      handleAddMember();
    }
  }, [location.state]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await memberService.getAll();
      const sortedMembers = [...response.data].sort((a, b) => {
        return a.id - b.id;
      });
      setMembers(sortedMembers);
      setError('');
    } catch (error) {
      setError('Failed to fetch members. Please try again later.');
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchMembers();
      return;
    }
    
    try {
      setLoading(true);
      const response = await memberService.search(searchQuery);
      const sortedResults = sortMembers(response.data, sortField, sortDirection);
      setMembers(sortedResults);
    } catch (error) {
      setError('Search failed. Please try again.');
      console.error('Error searching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!filterStatus && !filterType) {
      fetchMembers();
      return;
    }
    
    try {
      setLoading(true);
      const response = await memberService.filter(filterStatus, filterType);
      const sortedResults = sortMembers(response.data, sortField, sortDirection);
      setMembers(sortedResults);
    } catch (error) {
      setError('Filter failed. Please try again.');
      console.error('Error filtering members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setModalMode('add');
    setSelectedMemberId(null);
    setIsModalOpen(true);
  };

  const handleViewMember = (id) => {
    setModalMode('view');
    setSelectedMemberId(id);
    setIsModalOpen(true);
  };

  const handleEditMember = (id) => {
    setModalMode('edit');
    setSelectedMemberId(id);
    setIsModalOpen(true);
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }
    
    try {
      await memberService.delete(id);
      setMembers(members.filter(member => member.id !== id));
    } catch (error) {
      setError('Delete failed. Please try again.');
      console.error('Error deleting member:', error);
    }
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    const sortedMembers = sortMembers([...members], field, newDirection);
    setMembers(sortedMembers);
  };

  const sortMembers = (membersArray, field, direction) => {
    return [...membersArray].sort((a, b) => {
      if (a[field] === null) return direction === 'asc' ? 1 : -1;
      if (b[field] === null) return direction === 'asc' ? -1 : 1;
      
      if (field === 'id') {
        return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
      
      if (field === 'name') {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return direction === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      }

      if (typeof a[field] === 'string') {
        return direction === 'asc' 
          ? a[field].toLowerCase().localeCompare(b[field].toLowerCase()) 
          : b[field].toLowerCase().localeCompare(a[field].toLowerCase());
      }
      
      return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
    });
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-xl font-bold text-indigo-600">Fitness Center Management</Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {currentUser?.username || 'User'}
              </span>
              <Link
                to="/dashboard"
                className="mr-4 text-indigo-600 hover:text-indigo-900"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Members List</h2>
            <p className="mt-1 text-sm text-gray-600">
              View and manage your fitness center members
            </p>
          </div>
          <button
            onClick={handleAddMember}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Member
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="flex">
                  <input
                    id="search"
                    type="text"
                    placeholder="Search members..."
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Search
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filters</label>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="gold">Gold</option>
                  </select>
                  
                  <button
                    onClick={handleFilter}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Apply Filters
                  </button>
                  
                  <button
                    onClick={() => {
                      setFilterStatus('');
                      setFilterType('');
                      fetchMembers();
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <svg className="h-20 w-20 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new member</p>
            <div className="mt-6">
              <button
                onClick={handleAddMember}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add New Member
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    ID{renderSortIndicator('id')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name{renderSortIndicator('name')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    Email{renderSortIndicator('email')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('phone')}
                  >
                    Phone{renderSortIndicator('phone')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('membership_status')}
                  >
                    Status{renderSortIndicator('membership_status')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('membership_type')}
                  >
                    Type{renderSortIndicator('membership_type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${member.first_name} ${member.last_name}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.membership_status === 'active' ? 'bg-green-100 text-green-800' :
                        member.membership_status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.membership_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.membership_type === 'basic' ? 'bg-blue-100 text-blue-800' :
                        member.membership_type === 'premium' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.membership_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewMember(member.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditMember(member.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Member"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Member"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        memberId={selectedMemberId}
        onSuccess={fetchMembers}
      />
    </div>
  );
};

export default MembersList; 