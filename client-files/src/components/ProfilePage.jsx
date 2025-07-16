import React from 'react';
import './ProfilePage.css'

function ProfilePage() {
  return (
    <div className='profile-page'>
      <h1>Profile Page</h1>
      <div className='profile-field-row'>
        <div className='profile-field'>
          <label htmlFor="therapist-id">Therapist ID</label>
          <input type="text" />
        </div>
        <div className='profile-field'>
          <label htmlFor="name">Name</label>
          <input type="text" />
        </div>
      </div>
      <div className='profile-field-row'>
        <div className='profile-field'>
          <label htmlFor="email">Email</label>
          <input type="text" />
        </div>
        <div className='profile-field'>
          <label htmlFor="phone">Phone</label>
          <input type="text" />
        </div>
      </div>
      <div className='profile-field-row'>
        <div className='profile-field'>
          <label htmlFor="password">Password</label>
          <input type="text" />
        </div>
        <div className='profile-field'>
          <label htmlFor="specialization">Specialization</label>
          <input type="text" />
        </div>
      </div>
      <div className='profile-save'>
        <button>Save</button>
      </div>
    </div>
  );
}

export default ProfilePage;