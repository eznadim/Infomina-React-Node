import React, { useState, useEffect } from 'react';
import { memberService } from '../services/api';

const MemberModal = ({ isOpen, onClose, mode, memberId, onSuccess }) => {
  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    membership_status: 'active',
    membership_type: 'basic',
    joining_date: new Date().toISOString().split('T')[0],
    membership_expiry: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setError('');
      return;
    }

    if ((mode === 'edit' || mode === 'view') && memberId) {
      fetchMemberData();
    }
  }, [isOpen, mode, memberId]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await memberService.getById(memberId);
      
      const member = response.data;
      if (member.date_of_birth) {
        member.date_of_birth = formatDateForInput(member.date_of_birth);
      }
      if (member.joining_date) {
        member.joining_date = formatDateForInput(member.joining_date);
      }
      if (member.membership_expiry) {
        member.membership_expiry = formatDateForInput(member.membership_expiry);
      }
      
      setFormData(member);
      setError('');
    } catch (error) {
      setError('Failed to load member data');
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('First name, last name, and email are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      if (mode === 'add') {
        await memberService.create(formData);
      } else if (mode === 'edit') {
        await memberService.update(memberId, formData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || 
        `Failed to ${mode === 'add' ? 'create' : 'update'} member`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewOnly = mode === 'view';
  const title = mode === 'add' ? 'Add New Member' : 
              mode === 'edit' ? 'Edit Member' : 
              'Member Details';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                id="address"
                name="address"
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.address || ''}
                onChange={handleChange}
                disabled={isViewOnly}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.date_of_birth || ''}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
              </div>
              <div>
                <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                <input
                  type="date"
                  id="joining_date"
                  name="joining_date"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.joining_date || ''}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label htmlFor="membership_status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="membership_status"
                  name="membership_status"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.membership_status}
                  onChange={handleChange}
                  disabled={isViewOnly}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label htmlFor="membership_type" className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                <select
                  id="membership_type"
                  name="membership_type"
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.membership_type}
                  onChange={handleChange}
                  disabled={isViewOnly}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="membership_expiry" className="block text-sm font-medium text-gray-700 mb-1">Membership Expiry</label>
              <input
                type="date"
                id="membership_expiry"
                name="membership_expiry"
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.membership_expiry || ''}
                onChange={handleChange}
                disabled={isViewOnly}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isViewOnly ? 'Close' : 'Cancel'}
              </button>
              
              {!isViewOnly && (
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MemberModal; 