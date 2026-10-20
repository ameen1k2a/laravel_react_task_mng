import Axios from "axios";

export const getTaskList = async () => {
  return await Axios.get("/api/tasks")
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, data: [] }));
};

/**
 * storeNewTask()
 *
 * @param {object} data
 */
export const storeNewTask = async (data) => {
  data.project_id = parseInt(data.project_id);

  return await Axios.post("/api/tasks", data)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};

export const updateTask = async (id, data) => {
  return await Axios.put(`/api/tasks/${id}`, data)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};

export const deleteTask = async (id) => {
  return await Axios.delete(`/api/tasks/${id}`)
    .then((res) => res.data)
    .catch((err) => (err.response ? err.response.data : { success: false, message: "Network Error" }));
};
