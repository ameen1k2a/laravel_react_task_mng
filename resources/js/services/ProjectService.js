import Axios from "axios";

export const getProjectList = async () => {
  return await Axios.get("/api/projects")
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, data: [] }));
};

/**
 * storeNewProject()
 *
 * @param {object} data
 */
export const storeNewProject = async (data) => {
  return await Axios.post("/api/projects", data)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};

export const updateProject = async (id, data) => {
  return await Axios.put(`/api/projects/${id}`, data)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};

export const deleteProject = async (id) => {
  return await Axios.delete(`/api/projects/${id}`)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};
