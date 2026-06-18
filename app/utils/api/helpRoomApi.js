import instanceApi from "../../utils/api/axiosConfig";

export const helpRoomApi = {
  getHelpRooms: async () => {
    try {
      const response = await instanceApi.get("/api/help-room");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createHelpRoom: async (payload) => {
    try {
      if (payload instanceof FormData) {
        const response = await instanceApi.post("/api/help-room", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      }
      const response = await instanceApi.post("/api/help-room", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateHelpRoom: async (roomId, payload) => {
    try {
      if (payload instanceof FormData) {
        const response = await instanceApi.put(`/api/help-room/${roomId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      }
      const response = await instanceApi.put(`/api/help-room/${roomId}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteHelpRoom: async (roomId) => {
    try {
      const response = await instanceApi.delete(`/api/help-room/${roomId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
