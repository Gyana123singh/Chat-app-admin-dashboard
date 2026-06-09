"use client";

import { useState, useEffect } from "react";
import { helpRoomApi } from "../utils/api/helpRoomApi";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Mail, 
  Loader2, 
  X, 
  HelpCircle
} from "lucide-react";

export default function HelpLineManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [privacy, setPrivacy] = useState("public");
  const [emails, setEmails] = useState([""]); // Start with one empty email field
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Load help rooms
  const loadHelpRooms = async () => {
    setLoading(true);
    try {
      const res = await helpRoomApi.getHelpRooms();
      if (res.success) {
        setRooms(res.rooms || []);
      }
    } catch (error) {
      console.error("Failed to load help rooms", error);
      const errMsg = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to load help rooms from the server: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpRooms();
  }, []);

  // Handle email field additions/removals (Max 3)
  const handleAddEmailField = () => {
    if (emails.length < 3) {
      setEmails([...emails, ""]);
    }
  };

  const handleRemoveEmailField = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails.length ? newEmails : [""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setCategory("Other");
    setPrivacy("public");
    setEmails([""]);
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (room) => {
    setEditingRoom(room);
    setTitle(room.title || "");
    setDescription(room.description || "");
    setCategory(room.category || "Other");
    setPrivacy(room.privacy || "public");
    setIsActive(room.isActive !== false);
    setEmails(room.helpEmails && room.helpEmails.length ? [...room.helpEmails] : [""]);
    setIsEditOpen(true);
  };

  // Create Help Room
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Room title is required");
      return;
    }

    setSaving(true);
    try {
      const filteredEmails = emails.filter((email) => email.trim() !== "");
      const res = await helpRoomApi.createHelpRoom({
        title,
        description,
        category,
        privacy,
        helpEmails: filteredEmails,
      });

      if (res.success) {
        alert("Help Room created successfully!");
        setIsCreateOpen(false);
        loadHelpRooms();
      }
    } catch (error) {
      console.error("Create help room failed", error);
      alert(error.response?.data?.message || "Failed to create help room");
    } finally {
      setSaving(false);
    }
  };

  // Update Help Room
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Room title is required");
      return;
    }

    setSaving(true);
    try {
      const filteredEmails = emails.filter((email) => email.trim() !== "");
      const res = await helpRoomApi.updateHelpRoom(editingRoom.roomId, {
        title,
        description,
        category,
        privacy,
        helpEmails: filteredEmails,
        isActive,
      });

      if (res.success) {
        alert("Help Room updated successfully!");
        setIsEditOpen(false);
        loadHelpRooms();
      }
    } catch (error) {
      console.error("Update help room failed", error);
      alert(error.response?.data?.message || "Failed to update help room");
    } finally {
      setSaving(false);
    }
  };

  // Delete Help Room
  const handleDelete = async (roomId) => {
    if (!confirm("Are you sure you want to delete this Help Room? This will remove the room permanently and disconnect any active users.")) {
      return;
    }

    setDeletingId(roomId);
    try {
      const res = await helpRoomApi.deleteHelpRoom(roomId);
      if (res.success) {
        alert("Help Room deleted successfully!");
        loadHelpRooms();
      }
    } catch (error) {
      console.error("Delete help room failed", error);
      alert(error.response?.data?.message || "Failed to delete help room");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 w-full bg-[#f8f9fc] h-screen flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-gray-500 font-medium">Loading Help Line Rooms...</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full bg-[#f8f9fc] overflow-y-auto h-screen min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-gray-800 flex items-center gap-2">
            🛡️ Help Line Management
          </h1>
          <p className="text-gray-500">Configure permanent help rooms and alternative support emails</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md duration-150 self-start sm:self-auto"
        >
          <Plus size={18} />
          Create Help Room
        </button>
      </div>

      {/* NO DATA STATE */}
      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm mt-8">
          <HelpCircle size={48} className="text-blue-500 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Help Line Rooms Found</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Help line rooms remain active 24/7 in the user app and cannot be deleted when users leave. 
            Create your first help room to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold duration-150 shadow"
          >
            <Plus size={18} />
            Create Help Room
          </button>
        </div>
      ) : (
        /* ROOMS LIST */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 text-sm">
                <tr>
                  <th className="p-4 pl-6">Room Details</th>
                  <th className="p-4">Room ID</th>
                  <th className="p-4">Alternative Mail (Support)</th>
                  <th className="p-4">Privacy & Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50/50 duration-100">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-xl flex items-center justify-center text-lg shadow-inner">
                          {room.title ? room.title.substring(0, 2).toUpperCase() : "HL"}
                        </span>
                        <div>
                          <div className="font-bold text-gray-800 text-base">{room.title}</div>
                          {room.description && (
                            <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">{room.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-gray-700">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                        {room.roomId}
                      </span>
                    </td>
                    <td className="p-4">
                      {room.helpEmails && room.helpEmails.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {room.helpEmails.map((email, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md border border-blue-100 font-medium"
                            >
                              <Mail size={10} />
                              {email}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No support email set</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{room.category || "Other"}</span>
                        <span className="text-gray-600 text-xs capitalize">{room.privacy || "public"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          room.isActive !== false
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${room.isActive !== false ? "bg-green-600" : "bg-red-600"}`}></span>
                        {room.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg duration-150"
                          title="Edit Help Room"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(room.roomId)}
                          disabled={deletingId === room.roomId}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg duration-150 disabled:opacity-50"
                          title="Delete Help Room"
                        >
                          {deletingId === room.roomId ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Create Help Line Room</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-200/50 duration-150">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">Room Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. WAFA Support | वाफ़ा समर्थन"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Welcome Everyone! Tell users what this room is for."
                  rows="3"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150 bg-white"
                  >
                    <option value="Other">Other/Default</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-1.5">Privacy</label>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150 bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-gray-700 font-semibold text-sm">Alternative Support Emails (Max 3)</label>
                  {emails.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddEmailField}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                    >
                      + Add Email
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(idx, e.target.value)}
                          placeholder={`Email #${idx + 1}`}
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm duration-150"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmailField(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg duration-150"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 duration-150 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md duration-150 flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Edit Help Room</h3>
                <p className="text-xs text-gray-400">ID: {editingRoom?.roomId}</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1.5 hover:bg-gray-200/50 duration-150">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">Room Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Support Room"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this room for seekers..."
                  rows="3"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150 bg-white"
                  >
                    <option value="Other">Other/Default</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-1.5">Privacy</label>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 duration-150 bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <div className="font-semibold text-sm text-gray-800">Active State</div>
                  <div className="text-xs text-gray-400">If inactive, room won't show on user dashboard</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-gray-700 font-semibold text-sm">Alternative Support Emails (Max 3)</label>
                  {emails.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddEmailField}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                    >
                      + Add Email
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(idx, e.target.value)}
                          placeholder={`Email #${idx + 1}`}
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm duration-150"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmailField(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg duration-150"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 duration-150 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md duration-150 flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
