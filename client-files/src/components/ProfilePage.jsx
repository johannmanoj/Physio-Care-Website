import { useState, useEffect } from 'react';
import './ProfilePage.css'
import { useAuth } from "../context/AuthContext";
import axios from 'axios'
import { Toaster, toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const { userId } = useAuth();
  const TABS = ['Personal Info', 'Change Password'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const [profileData, setProfileData] = useState({
    id: '',
    email: '',
    name: '',
    phone: ''
  });

  // 🔑 state for password fields
  const [passwordData, setPasswordData] = useState({
    currentpass: "",
    newpassword: "",
    confirmpassword: ""
  });

  useEffect(() => {
    axios.post(`${API_URL}/api/users/get-user-details`, { "user_id": userId })
      .then((response) => {
        if (response.data.data.length > 0) {
          setProfileData(response.data.data[0])
        }
      })
      .catch((error) => {
        console.error('Error fetching players data:', error);
      });
  }, []);

  const updateProfileData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/users/update-user-profile`, profileData);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Error updating patient:', err);
      toast.error("Something went wrong!");
    }
  };

 const handlePasswordChange = async () => {
  if (!passwordData.currentpass || !passwordData.newpassword || !passwordData.confirmpassword) {
    toast.error("All fields are required");
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/api/users/change-password`, {
      user_id: userId,
      currentpass: passwordData.currentpass,
      newpassword: passwordData.newpassword,
      confirmpassword: passwordData.confirmpassword
    });

    toast.success(res.data.message || "Password updated successfully!");

    // clear fields
    setPasswordData({ currentpass: "", newpassword: "", confirmpassword: "" });
  } catch (err) {
    console.error("Error changing password:", err);

    // 🔑 Backend custom errors come in err.response.data
    if (err.response?.data?.errMsg) {
      toast.error(err.response.data.errMsg);
    } else {
      toast.error("Something went wrong!");
    }
  }
};


  return (
    <div className='profile-page'>
      <header className="patient-header">
        <h1>Profile Page</h1>
        <nav className="profile-main-heading-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`main-heading-tab ${activeTab === tab ? 'main-heading-tab--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Personal Info */}
      {activeTab === 'Personal Info' && (
        <div>
          <div className='data-field-row'>
            <div className='data-field data-field-2'>
              <label>Employee ID</label>
              <input
                name="id"
                value={profileData.id ?? ''}
                onChange={(e) => updateProfileData({ id: e.target.value })}
                readOnly
              />
            </div>
            <div className='data-field data-field-2'>
              <label>Name</label>
              <input
                name="name"
                value={profileData.name ?? ''}
                onChange={(e) => updateProfileData({ name: e.target.value })}
                placeholder="Name"
              />
            </div>
          </div>

          <div className='data-field-row'>
            <div className='data-field data-field-2'>
              <label>Email</label>
              <input
                name="email"
                value={profileData.email ?? ''}
                onChange={(e) => updateProfileData({ email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className='data-field data-field-2'>
              <label>Phone</label>
              <input
                name="phone"
                value={profileData.phone ?? ''}
                onChange={(e) => updateProfileData({ phone: e.target.value })}
                placeholder="Phone"
              />
            </div>
          </div>

          <div className='profile-save'>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}

      {/* Change Password */}
      {activeTab === 'Change Password' && (
        <div>
          <div className='data-field-row'>
            <div className='data-field data-field-3'>
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.currentpass}
                onChange={(e) => setPasswordData({ ...passwordData, currentpass: e.target.value })}
              />
            </div>
          </div>
          <div className='data-field-row'>
            <div className='data-field data-field-3'>
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newpassword}
                onChange={(e) => setPasswordData({ ...passwordData, newpassword: e.target.value })}
              />
            </div>
          </div>
          <div className='data-field-row'>
            <div className='data-field data-field-3'>
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmpassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmpassword: e.target.value })}
              />
            </div>
          </div>
          <div className='profile-save'>
            <button onClick={handlePasswordChange}>Update</button>
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #334155",
          }
        }}
      />
    </div>
  );
}

export default ProfilePage;
