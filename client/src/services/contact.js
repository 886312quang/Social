import api from "../api/api";

const services = {
  getContacts: async () => {
    const response = await api.get(`/contact`);
    return response;
  },
  findUserContacts: async (filter) => {
    const response = await api.get(`/contact/find-users/${filter}`);
    return response;
  },
  createContact: async (userInfo) => {
    const response = await api.post(`/contact/create`, userInfo);
    return response;
  },
  removeRequestSent: async (id) => {
    const response = await api.delete(`/contact/remove-request-sent/${id}`);
    return response;
  },
  removeRequest: async (id) => {
    const response = await api.delete(`/contact/remove-request/${id}`);
    return response;
  },
  removeContact: async (id) => {
    const response = await api.delete(`/contact/remove-contact/${id}`);
    return response;
  },
  acceptContact: async (id) => {
    const response = await api.put(`/contact/accept/${id}`);
    return response;
  },
};

export default services;
