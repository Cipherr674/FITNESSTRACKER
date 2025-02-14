import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../styles/profile.css";
import Aurora from '../components/Aurora';
import SubscriptionFlow from '../components/SubscriptionFlow';

const Profile = () => {
  const { user, isLoading } = useAuth();
  // Local state for bio and profile picture
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">Please login to view this page</div>;
  }

  // Update local state when the user changes
  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setPreview(user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "");
    }
  }, [user]);

  // Handle changes to the bio
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // Update image file and preview when a new file is chosen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit updated bio and profile picture to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("profilePicture", profilePic);
    }
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.user) {
        setPreview(`http://localhost:5000${response.data.user.profilePicture}`);
      }
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <Aurora amplitude={1.8} colorStops={["#2a0a45", "#4b1e6e", "#6d3b9e"]} />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <h2>My Profile</h2>
          </div>
          <div className="profile-info">
            {/* Profile image preview */}
            <div className="profile-image">
              {preview ? (
                <img src={preview} alt="Profile" />
              ) : (
                <div className="placeholder">No Image</div>
              )}
            </div>
            <div className="profile-details">
              <h2>{user?.name || 'Anonymous User'}</h2>
              <p className="profile-email">{user?.email || 'No email provided'}</p>
              {user.subscriptionStatus === 'active' && (
                <div className="premium-badge">
                  ⭐ Premium Member
                </div>
              )}
              <p className="profile-bio">{user.bio || "No bio yet"}</p>
            </div>
          </div>
          <div className="profile-form">
            <h3>Update Your Info</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
            {message && <p className="profile-message">{message}</p>}
          </div>
        </div>
        <div className="profile-badges">
          <h3>Your Badges</h3>
          {user?.badges && user.badges.length > 0 ? (
            <div className="badges-list">
              {user.badges.map((badge, index) => (
                <div key={index} className="badge-item1">
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No badges earned yet.</p>
          )}
        </div>
        <SubscriptionFlow user={user} />
      </div>
    </div>
  );
};

export default Profile;
