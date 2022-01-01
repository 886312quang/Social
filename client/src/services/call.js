import api from "../api/api";

const services = {
  getIceServer: async () => {
    const response = await api.get(`/user/iceServerList`);
    return response;
  },
};

export default services;
