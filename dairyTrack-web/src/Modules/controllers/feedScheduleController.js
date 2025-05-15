import { API_URL4 } from "../../api/apiController.js";

const getAllDailyFeeds = async (params = {}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token;

  const response = await fetch(`${API_URL4}/dailyFeedSchedule?${new URLSearchParams(params).toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data jadwal pakan");
  }
  return result;
};

const getDailyFeedById = async (id) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token;

  const response = await fetch(`${API_URL4}/dailyFeedSchedule/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil jadwal pakan");
  }
  return result;
};

const createDailyFeed = async (data) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token;

  const response = await fetch(`${API_URL4}/dailyFeedSchedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal membuat jadwal pakan");
  }
  return result;
};

const updateDailyFeed = async (id, data) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token;

  const response = await fetch(`${API_URL4}/dailyFeedSchedule/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui jadwal pakan");
  }
  return result;
};

const deleteDailyFeed = async (id) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token;

  const response = await fetch(`${API_URL4}/dailyFeedSchedule/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal menghapus jadwal pakan");
  }
  return result;
};

export { getAllDailyFeeds, getDailyFeedById, createDailyFeed, updateDailyFeed, deleteDailyFeed };