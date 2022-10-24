import api from "../api/api";

const services = {
  getNotifications: async () => {
    const response = await api.get(`/notification/`);
    return response;
  },
  markNotify: async (id) => {
    const response = await api.put(`/notification/mark-notify/${id}`);
    return response;
  },
  markNotifyAll: async () => {
    const response = await api.put(`/notification/markAllNotify`);
    return response;
  }
};

export default services;
