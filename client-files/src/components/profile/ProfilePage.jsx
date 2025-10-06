import { useState, useEffect } from 'react';
import { Toaster, toast } from "react-hot-toast";
import { FaChevronDown, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import './ProfilePage.css';

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const { userId } = useAuth();

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
      <header className="common-page-header">
        <div className='profile-header-section-1'>
          <h1>Profile</h1>
          <button
            onClick={handlePunch}
            className={`punch-btn ${isPunchedIn ? "out" : "in"}`}
          >
            {isPunchedIn ? "Punch Out" : "Punch In"}
          </button>
        </div>
      </header>

      <div className='user-page-sub-heading'>Personal Information</div>

      <div className='profile-field-grid'>
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
      </div>

      <div className='profile-field-grid'>
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
              type="number"
              name="phone"
              value={profileData.phone ?? ''}
              onChange={(e) => updateProfileData({ phone: e.target.value })}
              placeholder="Phone"
            />
          </div>
        </div>
      </div>



      <div className='user-page-sub-heading'>Change Password</div>

      <div className='profile-field-grid'>
        <div className='data-field-row'>
          <div className='data-field data-field-4'>
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentpass}
              onChange={(e) => setPasswordData({ ...passwordData, currentpass: e.target.value })}
            />
          </div>
          <div className='data-field data-field-4'>
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newpassword}
              onChange={(e) => setPasswordData({ ...passwordData, newpassword: e.target.value })}
            />
          </div>
          <div className='data-field data-field-4'>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmpassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmpassword: e.target.value })}
            />
          </div>
          <div className='data-field data-field-4'>
            <button onClick={handlePasswordChange} className='primary-button password-update-button'>Update</button>
          </div>
        </div>
      </div>


      <div className='user-page-sub-heading'>Bank Details</div>
      <div className='profile-field-grid'>
        <div className='data-field-row'>
          <div className='data-field data-field-4'>
            <label>Bank Name</label>
            <input
              name="bank_name"
              value={profileData.bank_name ?? ''}
              onChange={(e) => updateProfileData({ bank_name: e.target.value })}
              placeholder="Bank Name"
            />
          </div>
          <div className='data-field data-field-4'>
            <label>Account Holder Name</label>
            <input
              name="acc_holder_name"
              value={profileData.acc_holder_name ?? ''}
              onChange={(e) => updateProfileData({ acc_holder_name: e.target.value })}
              placeholder="Account Holder Name"
            />
          </div>
          <div className='data-field data-field-4'>
            <label>Account Number</label>
            <input
              type="number"
              name="acc_number"
              value={profileData.acc_number ?? ''}
              onChange={(e) => updateProfileData({ acc_number: e.target.value })}
              placeholder="Account Number"
            />
          </div>
          <div className='data-field data-field-4'>
            <label>IFSC Code</label>
            <input
              name="ifsc_code"
              value={profileData.ifsc_code ?? ''}
              onChange={(e) => updateProfileData({ ifsc_code: e.target.value })}
              placeholder="IFSC Code"
            />
          </div>
        </div>
      </div>

      <div className='common-page-footer-layout'>
        <button className='common-footer-bsave' onClick={handleSave}>Save</button>
      </div>

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
