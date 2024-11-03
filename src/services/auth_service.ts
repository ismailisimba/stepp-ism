import apiEndpoints from "@/constants/endpoints";
import { extractAxiosData } from "@/helpers/extractAxiosData";
import { parseAuthUserFromObject } from "@/models/AuthUser";
import { KeyValPair } from "@/types/KeyValPair";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const updateProfile = async (data: Object) => {
  let success = false;
  try {
    success = await axios.post(apiEndpoints.updateProfile, data).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      if (!data.success) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return data;
    });
  } catch (error) {
    throw error;
  }
  return success;
};

const sendPasswordResetEmail = async (data: Object) => {
  let success = false;
  try {
    success = await axios.post(apiEndpoints.resetPassword, data).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      if (!data.user) {
        throw new Error(`HTTP error! status: ${r.status}`);
      } else {
        if (data.user === "notregistered!") {
          throw new Error(`HTTP error! status: 503`);
        }
        return true;
      }
    });
  } catch (error) {
    throw error;
  }
  return success;
};

const changePassword = async (data: Object) => {
  let success = false;
  try {
    success = await axios.post(apiEndpoints.resetPassword, data).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      if (!data.success) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return true;
    });
  } catch (error) {
    throw error;
  }
  return success;
};

const signOut = async () => {
  let resp: KeyValPair = {};
  try {
    resp = await axios.get(apiEndpoints.logout).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return extractAxiosData(r) || [];
    });
  } catch (error) {
    throw error;
  }
  return resp;
};

const login = async (data: Object) => {
  let success = false;
  try {
    success = await axios.post(apiEndpoints.login, data).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const data = extractAxiosData(r);
      if (data.userData) {
        const authStore = useAuthStore();
        authStore.setUser(parseAuthUserFromObject(data.userData));
        return true;
      }
      return false;
    });
  } catch (error) {
    throw error;
  }
  return success;
};

const resetPassword = async (data: Object, id: string, secret: string) => {
  let success = false;
  try {
    success = await axios
      .post(
        `${apiEndpoints.completePasswordReset}/${encodeURIComponent(
          id
        )}/${encodeURIComponent(secret)}`,
        data
      )
      .then((r) => {
        if (r.status != 200) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        const data = extractAxiosData(r);
        if (data.user) {
          return true;
        }
        return false;
      });
  } catch (error) {
    throw error;
  }
  return success;
};

const signUpApplicant = async (data: Object) => {
  let resp: KeyValPair = {};
  try {
    resp = await axios.post(apiEndpoints.signUpApplicant, data).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return extractAxiosData(r) || [];
    });
  } catch (error) {
    throw error;
  }
  return resp;
};

const signUpDonor = async (data: Object) => {
  let resp: KeyValPair = {};
  try {
    resp = await axios.post(apiEndpoints.signUpDonor, data).then((r) => {
      if (r.status != 200) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return extractAxiosData(r) || [];
    });
  } catch (error) {
    throw error;
  }
  return resp;
};

export const checkAuthStatus = async () => {
  try {
    const { data } = await axios.get(apiEndpoints.checkUserStatus);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAuthUser = async () => {
  try {
    const { data } = await axios.get(apiEndpoints.getAuthUser);
    return parseAuthUserFromObject(data);
  } catch (error) {
    throw error;
  }
};

export const googleSignup = async (type: "donor" | "applicant") => {
  const clientId = "984361836876-ss43mi45jc5c7udn1d0vd84go0gct1tc.apps.googleusercontent.com";
  const stateUri = `https://${window.location.host}/sign-in/google`;
  const scope =
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
  const state = encodeURIComponent(stateUri);
  const loginUri = `https://grantman-czivjdfhnq-ez.a.run.app/signupwithgoogle-${type}`;
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(loginUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`;
  window.location.href = authUrl;
};

export const initiateGoogleAuth = async () => {
  const clientId = "984361836876-ss43mi45jc5c7udn1d0vd84go0gct1tc.apps.googleusercontent.com";
  const stateUri = `https://${window.location.host}/sign-in/google`;
  const scope =
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
  const state = encodeURIComponent(stateUri);
  const loginUri = "https://grantman-czivjdfhnq-ez.a.run.app/loginwithgoogle";
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(loginUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`;
  window.location.href = authUrl;
};

export {
  signUpApplicant,
  signUpDonor,
  login,
  signOut,
  updateProfile,
  changePassword,
  resetPassword,
  sendPasswordResetEmail,
};
