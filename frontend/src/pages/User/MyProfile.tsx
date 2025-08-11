import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import MyTrips from "./MyTrips";

type U = {
  _id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  avatar?: string;
};

const UserProfile: React.FC = () => {
  const [u, setU] = useState<U | null>(null);
  const [l, setL] = useState<boolean>(true);
  const [e, setE] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editCity, setEditCity] = useState<string>("");
  const [editCountry, setEditCountry] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const uid = useSelector((state: RootState) => state.auth.user_id);

  useEffect(() => {
    if (!uid) {
      setL(false);
      setE("User not authenticated.");
      return;
    }

    const fetchUser = async () => {
      setL(true);
      try {
        const res = await api.get(`/users/${uid}`);
        setU(res.data);
        setEditName(res.data.name);
        setEditCity(res.data.city);
        setEditCountry(res.data.country);
      } catch (err: any) {
        setE(err.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setL(false);
      }
    };

    fetchUser();
  }, [uid]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarError("");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.put(`/users/${uid}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setU((prevU) => (prevU ? { ...prevU, avatar: res.data.avatar } : res.data));
    } catch (err: any) {
      setAvatarError(err.response?.data?.message || "Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditError("");
    setEditName(u?.name || "");
    setEditCity(u?.city || "");
    setEditCountry(u?.country || "");
  };

  const handleEditSubmit = async () => {
    setIsEditing(true);
    setEditError("");
    try {
      const res = await api.put(`/users/${uid}`, {
        name: editName,
        city: editCity,
        country: editCountry,
      });
      setU(res.data);
      closeEditModal();
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsEditing(false);
    }
  };

  const mainStyle: React.CSSProperties = {
    backgroundColor: "#121212",
    color: "#eee",
    padding: "20px 40px",
    fontFamily: "'Segoe UI', sans-serif",
    minHeight: "100vh",
  };

  const profileBoxStyle: React.CSSProperties = {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "40px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
  };

  const avatarContainerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const avatarStyle: React.CSSProperties = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #444",
  };

  const uploadIconStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "50%",
    padding: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  };

  const editBtnStyle: React.CSSProperties = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#007bff",
    marginTop: "15px",
  };

  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: "#222",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    maxWidth: "90%",
    color: "#eee",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#333",
    color: "#eee",
  };

  const modalBtnContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "20px",
  };

  const modalBtnStyle = (color: string): React.CSSProperties => ({
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: color,
  });

  if (l) return <div style={mainStyle}><p>Loading Profile...</p></div>;
  if (e) return <div style={mainStyle}><p style={{ color: "red" }}>{e}</p></div>;
  if (!u) return <div style={mainStyle}><p>Could not find user profile.</p></div>;

  return (
    <div style={mainStyle}>
      <div style={profileBoxStyle}>
        <div style={avatarContainerStyle}>
          <img
            src={u.avatar || `https://via.placeholder.com/120?text=${u.name.charAt(0)}`}
            alt="User"
            style={avatarStyle}
          />
          <label htmlFor="avatarUpload" style={uploadIconStyle}>
            <i className="fas fa-camera"></i>
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
          />
          {uploadingAvatar && <small>Uploading...</small>}
          {avatarError && <p style={{ color: "red", marginTop: "5px" }}>{avatarError}</p>}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "2.5rem" }}>{u.name}</h1>
          <p style={{ margin: "5px 0 15px", color: "#aaa" }}>
            {u.city}, {u.country}
          </p>
          <button style={editBtnStyle} onClick={openEditModal}>Edit Profile</button>
        </div>
      </div>

      <MyTrips />

      {showEditModal && (
        <div style={modalStyle} onClick={closeEditModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              style={inputStyle}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              style={inputStyle}
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
            />
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              style={inputStyle}
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
            />
            {editError && <p style={{ color: "red" }}>{editError}</p>}
            <div style={modalBtnContainerStyle}>
              <button style={modalBtnStyle("#555")} onClick={closeEditModal} disabled={isEditing}>
                Cancel
              </button>
              <button style={modalBtnStyle("green")} onClick={handleEditSubmit} disabled={isEditing}>
                {isEditing ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;