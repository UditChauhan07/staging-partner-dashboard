import axios from "axios";
// const URL = "http://localhost:2512";
// const URL="https://rex-bk.truet.net"
const URL = process.env.NEXT_PUBLIC_API_URL;
//  || "https://rexptin.truet.net"
// admin login api
export const adminLogin = async (email, password) => {
  try {
    const res = await axios.post(`${URL}/api/admin/partner/login`, {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    }
    throw new Error("Login failed. Please try again.");
  }
};
// Get user analytics
export const getAnalytics = async () => {
  try {
    const res = await axios.get(`${URL}/api/analytics/useranalytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch analytics data");
  }
};
// get all users
export const retrieveAllRegisteredUsers = async () => {
  try {
    const response = await axios.get(`${URL}/api/endusers/getAllUsers2`);
    return response.data.users;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return { data: { msg: "Something went wrong" } };
    }
  }
};
// delete user
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(
      `${URL}/api/agent/delete-user/db/${id}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return { data: { msg: "Something went wrong" } };
    }
  }
};
// get users with agents
export const retrieveAllRegisteredUsers2 = async () => {
  try {
    const response = await axios.get(`${URL}/api/endusers/getAllUsers`);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return { data: { msg: "Something went wrong" } };
    }
  }
};
//save user
export const addUser = async (userData) => {
  try {
    const response = await axios.post(
      `${URL}/api/endusers/createUserByAdmin`,
      userData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return { data: { msg: "Something went wrong" } };
    }
  }
};
// delete agent permanently
export const deleteAgent = async (id) => {
  try {
    const response = await axios.delete(
      `${URL}/api/agent/AgentDelete/hard/${id}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return { data: { msg: "Something went wrong" } };
    }
  }
};
// deactivate agent from retel
export const deactivateAgent = async (id) => {
  try {
    const response = await axios.delete(
      `${URL}/api/agent/delete-user-agent/${id}`
    );
    console.log(response, "backend response");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return { data: { msg: "Something went wrong" } };
    }
  }
};
export const getRetellVoices = async () => {
  const res = await axios.get(`${URL}/api/agent/voicelist/api`);
  console.log(res);
  return res.data.voices;
};
// export const getRetellVoices = async () => {
//   const res = await axios.get('https://api.retellai.com/list-voices', {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//     },
//   });
//   console.log(res)
//   return res.data;
// };
export const createAgent = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${URL}/api/agent/createAgent`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
export const fetchAgentDetailById = async (data: {
  agentId: string;
  businessId: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${URL}/api/agent/fetchAgentDetailsById`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // ensure token is defined
    },
  });
  return res.data; // should return { agent, business }
};
export const validateWebsite = async (websiteUrl) => {
  try {
    const res = await axios.post(`${URL}/api/validate-website`, {
      website: websiteUrl,
    });
    return res.data;
  } catch (error) {
    console.error("Error validating website:", error);
    return { valid: false, reason: "Error validating website" };
  }
};
export const countAgentsbyUserId = async (userId) => {
  try {
    const res = await axios.get(`${URL}/api/agent/listAgents?userId=${userId}`);
    console.log("res", res);
    return res.data.length || 0;
  } catch (error) {
    console.error("Error fetching agent count:", error);
    return 0;
  }
};

export const updateAgent = async (agentId, updateData) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.put(
      `${URL}/api/agent/updateAgent/${agentId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error while adding assign number at db", error);
  }
};
//raise request
export const raiseRequest = async (payload: {
  userId: string;
  email: string;
  comment: string;
}) => {
  try {
    const res = await axios.post(`${URL}/api/endusers/raiserequest`, payload);
    return res.data;
  } catch (err) {
    console.error("Error raising request:", err);
    return { status: false, error: err };
  }
};

export const raiseagentRequest = async (payload: {
  agentId: string;
  email: string;
  comment: string;
}) => {
  try {
    const res = await axios.post(`${URL}/api/agent/raiseagentrequest`, payload);
    return res.data;
  } catch (err) {
    console.error("Error raising request:", err);
    return { status: false, error: err };
  }
};
export const getAllRaiseUserRequest = async () => {
  try {
    const res = await axios.get(`${URL}/api/endusers/getallrequest`);
    return res.data;
  } catch (err) {
    console.error("Error raising request:", err);
    return { status: false, error: err };
  }
};

export const checkUserRequestStatus = async (userId: string) => {
  try {
    const res = await fetch(`${URL}/api/endusers/getuserrequest/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch request status");
    const data = await res.json();
    // data is { alreadyRequested: boolean, status: string | null }
    return data;
  } catch (err) {
    console.error("Error in checkUserRequestStatus:", err);
    return { alreadyRequested: false, status: null }; // fallback
  }
};
export const getAgentRequestStatus = async (agentId: string) => {
  try {
    const res = await fetch(`${URL}/api/analytics/getAgentStatus/${agentId}`);
    if (!res.ok) throw new Error("Failed to fetch request status");
    const data = await res.json();
    // data is { alreadyRequested: boolean, status: string | null }
    return data;
  } catch (err) {
    console.error("Error in checkUserRequestStatus:", err);
    return { alreadyRequested: false, status: null }; // fallback
  }
};

// export const deleteAgent = async (agentId) => {
//   try {
//     const res = await axios.delete(`/agent/deleteAgent/${agentId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
//       },
//     });
//     await axios.delete(`https://api.retellai.com/delete-agent/${agentId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
//       },
//     });

//     return res.data;
//   } catch (error) {
//     console.error(
//       "Error deleting agent:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to delete agent from one or both systems.");
//   }
// };
