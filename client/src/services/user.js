import api from "../api/api";

const services = {
  getCurrentUser: async () => {
    const response = await api.get("/user/current");
    return response;
  },
  listFriend: async ({ term }) => {
    let url = "/user";
    url = term ? url + `?term=${term}` : url;
    const response = await api.get(url);
    return response;
  },
  doUpdatePassword: async (values) => {
    const response = await api.put("/user/updatePassword", values);
    return response;
  },
  getUserUpdate: async (id) => {
    const response = await api.get(`/user/${id}`);
    return response;
  },
  updateInfo: async (dataUpdate) => {
    const response = await api.put("/user", dataUpdate);
    return response;
  },
  updateAvatar: async (avatar) => {
    const response = await api.post("/user/updateAvatar", avatar);
    return response;
  },
};

export default services;
