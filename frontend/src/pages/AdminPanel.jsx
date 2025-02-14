import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminPanel.css';
import AdminNavbar from '../components/AdminNavbar';
import { FiArrowLeft } from 'react-icons/fi';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // Workouts state
  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(true);
  const [workoutsError, setWorkoutsError] = useState("");

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  const token = sessionStorage.getItem("token");

  // Selected user state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [userWorkoutsLoading, setUserWorkoutsLoading] = useState(false);
  const [userWorkoutsError, setUserWorkoutsError] = useState("");

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setUsersLoading(false);
    } catch (error) {
      setUsersError("Error fetching users");
      setUsersLoading(false);
    }
  };

  // Fetch Workouts
  const fetchWorkouts = async () => {
    try {
      setWorkoutsLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(response.data.workouts);
      setWorkoutsLoading(false);
    } catch (error) {
      setWorkoutsError("Error fetching workouts");
      setWorkoutsLoading(false);
    }
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data.data);
      setAnalyticsLoading(false);
    } catch (error) {
      setAnalyticsError("Error fetching analytics");
      setAnalyticsLoading(false);
    }
  };

  // Add new function to fetch user's workouts
  const fetchUserWorkouts = async (userId) => {
    try {
      setUserWorkoutsLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserWorkouts(response.data.workouts);
      setUserWorkoutsLoading(false);
    } catch (error) {
      setUserWorkoutsError("Error fetching user workouts");
      setUserWorkoutsLoading(false);
    }
  };

  // Function to view user's workouts
  const handleViewUserWorkouts = (user) => {
    setSelectedUser(user);
    fetchUserWorkouts(user._id);
  };

  // Function to go back to users list
  const handleBackToUsers = () => {
    setSelectedUser(null);
    setUserWorkouts([]);
    setUserWorkoutsError("");
  };

  // Add UserWorkoutsView component
  const UserWorkoutsView = () => (
    <div className="user-workouts-view">
      <div className="view-header">
        <button onClick={handleBackToUsers} className="back-button">
          <FiArrowLeft /> Back to Users
        </button>
        <h2>{selectedUser.name}'s Workouts</h2>
        <p>Email: {selectedUser.email}</p>
      </div>

      {userWorkoutsLoading ? (
        <div className="loading-state">
          <p>Loading workouts...</p>
        </div>
      ) : userWorkoutsError ? (
        <div className="error-state">
          <p>{userWorkoutsError}</p>
        </div>
      ) : (
        <div className="user-workouts-content">
          {userWorkouts.length === 0 ? (
            <p className="no-workouts">No workouts found for this user.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Points</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {userWorkouts.map((workout) => (
                  <tr key={workout._id}>
                    <td>{new Date(workout.date).toLocaleDateString()}</td>
                    <td>{workout.type}</td>
                    <td>{workout.name}</td>
                    <td>{workout.points}</td>
                    <td>
                      {workout.type === 'cardio' ? (
                        `Duration: ${workout.duration} minutes`
                      ) : (
                        workout.exercises && workout.exercises.length > 0 ? (
                          <details>
                            <summary>View Exercises</summary>
                            <div className="exercises-details">
                              {workout.exercises.map((exercise, index) => (
                                <div key={index} className="exercise-item">
                                  <strong>{exercise.name || 'Unnamed Exercise'}</strong>
                                  <span>
                                    {exercise.sets} sets × {exercise.reps} reps
                                    {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </details>
                        ) : (
                          'No details available'
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "workouts") {
      fetchWorkouts();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  // User deletion
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        alert("Error deleting user");
      }
    }
  };

  // Workout deletion
  const handleDeleteWorkout = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchWorkouts();
      } catch (err) {
        alert("Error deleting workout");
      }
    }
  };

  // Update functions for inline editing
  const handleUpdateUser = async (id, updatedFields) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Error updating user");
    }
  };

  const handleUpdateWorkout = async (id, updatedFields) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/workouts/${id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkouts();
    } catch (err) {
      alert("Error updating workout");
    }
  };

  // Local state for editing users
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");

  const startEditUser = (user) => {
    setEditUserId(user._id);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
  };

  const cancelEditUser = () => {
    setEditUserId(null);
  };

  const submitEditUser = async (id) => {
    await handleUpdateUser(id, {
      name: editUserName,
      email: editUserEmail,
      role: editUserRole,
    });
    setEditUserId(null);
  };

  // Local state for editing workouts
  const [editWorkoutId, setEditWorkoutId] = useState(null);
  const [editWorkoutName, setEditWorkoutName] = useState("");

  const startEditWorkout = (workout) => {
    setEditWorkoutId(workout._id);
    setEditWorkoutName(workout.name);
  };

  const cancelEditWorkout = () => {
    setEditWorkoutId(null);
  };

  const submitEditWorkout = async (id) => {
    await handleUpdateWorkout(id, { name: editWorkoutName });
    setEditWorkoutId(null);
  };

  // Modify the users section to include the view button
  const modifiedUsersSection = (
    <div className="admin-section">
      <div className="section-header">
        <h2>Users Management</h2>
        <p>Manage user accounts and permissions</p>
      </div>
      {usersLoading ? (
        <div className="loading-state">
          <p>Loading users...</p>
        </div>
      ) : usersError ? (
        <div className="error-state">
          <p>{usersError}</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editUserId === user._id ? (
                    <input
                      type="text"
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editUserId === user._id ? (
                    <input
                      type="email"
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editUserId === user._id ? (
                    <select
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editUserId === user._id ? (
                    <>
                      <button onClick={() => submitEditUser(user._id)} className="admin-button btn-edit">Save</button>
                      <button onClick={cancelEditUser} className="admin-button btn-cancel">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleViewUserWorkouts(user)} 
                        className="admin-button btn-view"
                      >
                        View Workouts
                      </button>
                      <button onClick={() => startEditUser(user)} className="admin-button btn-edit">Edit</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="admin-button btn-delete">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="admin-panel-container">
      <div className="admin-panel">
        <h1 className="admin-title">Admin Dashboard</h1>
        <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="admin-content-wrapper">
          {activeTab === "users" && (
            selectedUser ? <UserWorkoutsView /> : modifiedUsersSection
          )}

          {activeTab === "workouts" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Workout Management</h2>
                <p>View and manage user workouts</p>
              </div>
              {workoutsLoading ? (
                <div className="loading-state">
                  <p>Loading workouts...</p>
                </div>
              ) : workoutsError ? (
                <div className="error-state">
                  <p>{workoutsError}</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Points</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((workout) => (
                      <tr key={workout._id}>
                        <td>{workout.name}</td>
                        <td>{workout.user?.name || 'Deleted User'}</td>
                        <td>{workout.type}</td>
                        <td>{workout.points}</td>
                        <td>{new Date(workout.date).toLocaleString()}</td>
                        <td>
                          {editWorkoutId === workout._id ? (
                            <>
                              <button 
                                onClick={() => submitEditWorkout(workout._id)} 
                                className="admin-button btn-save"
                              >
                                Save
                              </button>
                              <button 
                                onClick={cancelEditWorkout} 
                                className="admin-button btn-cancel"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => startEditWorkout(workout)} 
                                className="admin-button btn-edit"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteWorkout(workout._id)} 
                                className="admin-button btn-delete"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Analytics Overview</h2>
                <p>Platform statistics and metrics</p>
              </div>
              {analyticsLoading ? (
                <div className="loading-state">
                  <p>Loading analytics...</p>
                </div>
              ) : analyticsError ? (
                <div className="error-state">
                  <p>{analyticsError}</p>
                </div>
              ) : (
                <div className="analytics-grid">
                  <div className="analytics-card elevation-1">
                    <h3>Total Users</h3>
                    <div className="analytics-value">
                      <span className="number">{analytics.totalUsers}</span>
                      <span className="label">Users</span>
                    </div>
                  </div>
                  <div className="analytics-card elevation-1">
                    <h3>Total Workouts</h3>
                    <div className="analytics-value">
                      <span className="number">{analytics.totalWorkouts}</span>
                      <span className="label">Workouts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 