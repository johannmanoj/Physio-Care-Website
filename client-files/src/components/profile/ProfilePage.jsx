import { useState, useEffect } from 'react';
import { Toaster, toast } from "react-hot-toast";
import { FaChevronDown, FaUserCircle, FaSignOutAlt, FaPencilAlt } from 'react-icons/fa';
import { MdAccessTimeFilled, MdAccessTime } from 'react-icons/md';
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

  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [uploading, setUploading] = useState(false);



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
      setShowPersonalInfoModal(false)
      setShowBankDetailsModal(false)
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

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "profile");

    try {
      setUploading(true);
      const res = await axios.post(`${API_URL}/api/files/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.url;

      // ✅ Just add image URL to state (not saving to DB yet)
      setProfileData(prev => ({ ...prev, profile_pic: imageUrl }));
      toast.success("Profile picture uploaded!");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };


  const today = new Date().toISOString().split("T")[0];
  const isPunchedIn = profileData.attendance?.[today]?.in && !profileData.attendance?.[today]?.out;

  return (
    <div className='profile-page'>

      <header className="profile-page-header">
        <div className='profile-header-section-1'>
          <h1>Profile</h1>
          <button
            onClick={handlePunch}
            className={`punch-btn ${isPunchedIn ? "out" : "in"}`}
          >
            {isPunchedIn ?
              <div className='punch-button-layout'>
                <MdAccessTime size={20} />
                <div> Punch Out</div>
              </div>
              :
              <div className='punch-button-layout'>
                <MdAccessTimeFilled size={20} />
                <div> Punch In </div>
              </div>
            }
          </button>
        </div>
      </header>


      <div className='profile-page-sections'>
        <div className='profile-info-header'>
          <div className="profile-pic-wrapper">
            {profileData.profile_pic ? (
              <img
                src={profileData.profile_pic}
                alt="Profile"
                className="profile-info-header-pic"
              />
            ) : (
              <FaUserCircle className="profile-info-header-pic" />
            )}

            <label htmlFor="profilePicUpload" className="upload-icon">
              <FaPencilAlt />
              <input
                type="file"
                id="profilePicUpload"
                accept="image/*"
                onChange={handleProfilePicUpload}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
          {/* <FaUserCircle className='profile-info-header-pic' /> */}
          <div className='profile-info-header-sub-text'>
            <h1>
              {profileData.name ?? ''}
            </h1>
            <div>
              {` ${profileData.role ?? ''}  | ID : ${profileData.id ?? ''}`}
            </div>

          </div>
          {/* <button className='profile-edit-button'><FaPencilAlt /> Edit</button> */}
        </div>
      </div>

      <div className='profile-page-sections'>
        <div className='profile-info-header'>
          <h1>Personal Information</h1>

          <button className='profile-edit-button' onClick={() => setShowPersonalInfoModal(true)}><FaPencilAlt /> Edit</button>
        </div>

        <div className='data-field-row'>
          <div className='data-field data-field-4'>
            <h2>Name</h2>
            <div className='profile-page-sections-label'>{profileData.name ?? ''}</div>
          </div>
          <div className='data-field data-field-4'>
            <h2>DOB</h2>
            <div className='profile-page-sections-label'>{profileData.dob ?? ''}</div>
          </div>
        </div>

        <div className='data-field-row'>
          <div className='data-field data-field-4'>
            <h2>Email</h2>
            <div className='profile-page-sections-label'>{profileData.email ?? ''}</div>
          </div>
          <div className='data-field data-field-4'>
            <h2>Phone</h2>
            <div className='profile-page-sections-label'>{profileData.phone ?? ''}</div>
          </div>
        </div>

      </div>

      <div className='profile-page-sections'>

        <div className='profile-info-header'>
          <h1>Bank Details</h1>
          <button className='profile-edit-button' onClick={() => setShowBankDetailsModal(true)}><FaPencilAlt /> Edit</button>
        </div>

        <div className='data-field-row'>
          <div className='data-field data-field-4'>
            <h2>Bank Name</h2>
            <div className='profile-page-sections-label'>{profileData.bank_name ?? ''}</div>
          </div>
          <div className='data-field data-field-4'>
            <h2>Account Holder Name</h2>
            <div className='profile-page-sections-label'>{profileData.acc_holder_name ?? ''}</div>
          </div>
        </div>
        
        <div className='data-field-row'>
          <div className='data-field data-field-4'>
            <h2>Account Number</h2>
            <div className='profile-page-sections-label'>{profileData.acc_number ?? ''}</div>
          </div>
          <div className='data-field data-field-4'>
            <h2>IFSC Code</h2>
            <div className='profile-page-sections-label'>{profileData.ifsc_code ?? ''}</div>
          </div>
        </div>

      </div>

      <div className='profile-page-sections'>
        <div className='profile-info-header'>
          <h1>Change Password</h1>

          {/* <button className='profile-edit-button'><FaPencilAlt /> Edit</button> */}

        </div>

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


      
      {showPersonalInfoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Personal Information</h2>
            <label>Name</label>
            <input
              name="name"
              value={profileData.name ?? ''}
              onChange={(e) => updateProfileData({ name: e.target.value })}
              placeholder="Name"
            />
            <label>DOB</label>
            <input
              type="date"
              value={profileData.dob ?? ''}
              onChange={(e) => updateProfileData({ dob: e.target.value })}
            />
            <label>Email</label>
            <input
              name="email"
              value={profileData.email ?? ''}
              onChange={(e) => updateProfileData({ email: e.target.value })}
              placeholder="Email"
            />
            <label>Phone</label>
            <input
              type="number"
              name="phone"
              value={profileData.phone ?? ''}
              onChange={(e) => updateProfileData({ phone: e.target.value })}
              placeholder="Phone"
            />


            <div className="modal-buttons">
              <button className="view-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={() => setShowPersonalInfoModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showBankDetailsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Bank Details</h2>

            <label>Bank Name</label>
            <input
              name="bank_name"
              value={profileData.bank_name ?? ''}
              onChange={(e) => updateProfileData({ bank_name: e.target.value })}
              placeholder="Bank Name"
            />

            <label>Account Holder Name</label>
            <input
              name="acc_holder_name"
              value={profileData.acc_holder_name ?? ''}
              onChange={(e) => updateProfileData({ acc_holder_name: e.target.value })}
              placeholder="Account Holder Name"
            />

            <label>Account Number</label>
            <input
              type="number"
              name="acc_number"
              value={profileData.acc_number ?? ''}
              onChange={(e) => updateProfileData({ acc_number: e.target.value })}
              placeholder="Account Number"
            />

            <label>IFSC Code</label>
            <input
              name="ifsc_code"
              value={profileData.ifsc_code ?? ''}
              onChange={(e) => updateProfileData({ ifsc_code: e.target.value })}
              placeholder="IFSC Code"
            />

            <div className="modal-buttons">
              <button className="view-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={() => setShowBankDetailsModal(false)}>Cancel</button>
            </div>
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
