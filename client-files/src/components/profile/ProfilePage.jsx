import { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import PersonalInfo from './PersonalInfo';

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const { userId } = useAuth();
  const TABS = ['Personal Info', 'Change Password'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const [profileData, setProfileData] = useState({
    id: '',
    email: '',
    name: '',
    phone: '',
    attendance: {}
  });

  const [passwordData, setPasswordData] = useState({
    currentpass: "",
    newpassword: "",
    confirmpassword: ""
  });


  useEffect(() => {
    axios.post(`${API_URL}/api/users/get-user-details`, { "user_id": userId })
      .then((response) => {
        if (response.data.data.length > 0) {
          const userData = response.data.data[0];
          setProfileData(prev => ({
            ...prev,
            ...userData,
            attendance: userData.attendance || {}
          }));
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
      await axios.post(`${API_URL}/api/users/update-user-profile`, profileData);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Error updating patient:', err);
      toast.error("Something went wrong!");
    }
  };

  const handlePunch = async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const now = new Date().toISOString();

    let updatedAttendance = { ...profileData.attendance };

    if (!updatedAttendance[today]) {
      // No record today → Punch In
      updatedAttendance[today] = { in: now, out: "" };
      toast.success("Punched In!");
    } else if (!updatedAttendance[today].out) {
      // Already punched in → Punch Out
      updatedAttendance[today].out = now;
      toast.success("Punched Out!");
    } else {
      toast.error("Already punched out today!");
      return;
    }

    const updatedProfile = {
      ...profileData,
      attendance: JSON.stringify(updatedAttendance)   // ✅ stringify before saving
    };

    setProfileData({ ...profileData, attendance: updatedAttendance }); // keep state as object for easy usage

    try {
      await axios.post(`${API_URL}/api/users/update-user-attendance`, updatedProfile);
    } catch (err) {
      console.error("Error updating attendance:", err);
      toast.error("Failed to update attendance!");
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


  const today = new Date().toISOString().split("T")[0];
  const isPunchedIn = profileData.attendance?.[today]?.in && !profileData.attendance?.[today]?.out;

  return (
    <div className='profile-page'>
      <header className="patient-header">
        <div className='profile-header-section-1'>
          <h1>Profile Page</h1>
          <button
            onClick={handlePunch}
            className={`punch-btn ${isPunchedIn ? "out" : "in"}`}
          >
            {isPunchedIn ? "Punch Out" : "Punch In"}
          </button>
        </div>

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

      {activeTab === 'Personal Info' && (
        <PersonalInfo profileData={profileData} updateProfileData={updateProfileData} handleSave={handleSave} />
      )}

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
