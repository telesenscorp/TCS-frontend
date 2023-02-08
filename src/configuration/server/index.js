import Axios from "axios";
import { API_URL } from "../../common/constants";
import { log } from "../../utils/logger";
import { waiter } from "../../utils/waiter";
import store from "../redux";
import { authUpdate } from "../redux/Auth.slice";
const Routes = {
  get: {
    ping: "ping",
    content: "content",
    allUsers: "auth/users/all",
    allPosts: "posts/all",
    allFiles: "files/all",
    allMails: "mails/all",
    mailsByTypeMessage: "mails/by-type/message",
    mailsByTypeVacancy: "mails/by-type/vacancy",
    allBackups: "backup/all",
    allAnalytics: "analytics/all",
    analyticsToday: "analytics/today",
    analyticsThisWeek: "analytics/this-week",
    analyticsThisMonth: "analytics/this-month",
  },
  post: {
    login: "auth/login",
    refresh: "auth/refresh",
    createUser: "auth/register",
    createPost: "posts/create",
    createMail: "mails/create",
    createContent: "content/create",
    files: "files",
    filesBulk: "files/bulk",
    filesBulkStrict: "files/bulk-strict",
    filesBackup: "files/backup",
    whoAmI: "auth/who-am-i",
    createPosts: "posts/bulk-create",
    createContents: "content/bulk-create",
    createEvent: "analytics/create-event",
  },
  del: {},
  put: {},
};
const delay = 2;

export const api = Axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getUser = () => {
  return store.getState().auth;
};

const refresher = {
  isRefreshing: false,
  status: "none",
};

const waitRefresher = async () => {
  if (refresher.isRefreshing) {
    await waiter(delay);
    if (refresher.status === "pending") {
      await waiter(delay);
    }
  }
};

const refresh = (isRef, ref) => {
  refresher.isRefreshing = isRef;
  refresher.status = ref;
};

export const setToken = (token) => (api.defaults.headers.common.Authorization = `Bearer ${token}`);

export const Get = async (key, fn = () => {}, fail = () => {}) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const route = typeof key === "string" ? Routes.get[key] : key.join("/");
    const { data, status } = await api.get(route);
    if (status < 300) {
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};

export const Post = async (key, input, fn = () => {}, fail = () => {}, opt) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const route = typeof key === "string" ? Routes.post[key] : key.join("/");
    const { data, status } = await api.post(route, input, opt);
    if (status < 300) {
      if (key === "login" || key === "refreshToken") {
        setToken(data.access_token);
      }
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};

export const Put = async (key = [""], input, fn = () => {}, fail = () => {}) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const { data, status } = await api.put(key.join("/"), input);
    if (status < 300) {
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};

export const Del = async (key = [""], fn = () => {}, fail = () => {}) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const { data, status } = await api.delete(key.join("/"));
    if (status < 300) {
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};

export const Upload = async (input, fn = () => {}, fail = () => {}, opt) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const buffer = new FormData();
    buffer.append("file", input);
    const { data, status } = await api.post(Routes.post.files, buffer, opt);
    if (status < 300) {
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};

export const UploadBackup = async (input, fn = () => {}, fail = () => {}, opt) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const buffer = new FormData();
    buffer.append("file", input);
    const { data, status } = await api.post(Routes.post.filesBackup, buffer, opt);
    if (status < 300) {
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};

export const BulkUpload = async (inputs = [], strict, fn = () => {}, fail = () => {}, opt) => {
  await waitRefresher();
  if (refresher.isRefreshing) {
    fail(null);
  }
  try {
    const buffer = new FormData();
    inputs.forEach((input) => buffer.append("files", input));
    const { filesBulk, filesBulkStrict } = Routes.post;
    const { data, status } = await api.post(strict ? filesBulkStrict : filesBulk, buffer, {
      headers: {
        "Content-Type": "multipart/form-data, application/x-object",
      },
      ...opt,
    });
    if (status < 300) {
      fn(data);
      return data;
    }
  } catch (err) {
    fail(err);
    return null;
  }
};
// Settings
export const setup = (token = "", fn = () => { }) => {
  if (token) {
    setToken(token);
  }
  api.interceptors.request.use(async (config) => {
    log.request(config);
    return config;
  });
  api.interceptors.response.use(
    (response) => {
      log.response(response);
      return response;
    },
    async (error) => {
      log.error(error.response);
      const newConfig = error.config;
      if (error?.response?.status === 403 && error.response.config.method !== "get") {
        fn("You don't have the permission to do that");
      }
      if (error?.response?.status === 401) {
        if (refresher.isRefreshing) {
          await waiter(delay);
          newConfig._retry = true;
          return new Promise(async (resolve, reject) => {
            try {
              resolve(api(newConfig));
            } catch (err) {
              reject(err);
            }
          });
        }
        refresh(true, "pending");
        const { refreshToken } = getUser();
        return new Promise(async (resolve, reject) => {
          try {
            const { data, status } = await api.post(Routes.post.refresh, { token: refreshToken });
            if (status < 300) {
              setToken(data.accessToken);
              store.dispatch(authUpdate(data));
              refresh(false, "none");
              newConfig.headers.Authorization = `Bearer ${data.accessToken}`;
              resolve(api(newConfig));
            }
          } catch (err) {
            refresh(false, "none");
            store.dispatch(authUpdate({ logged: false }));
            reject(err);
          }
        });
      }
      return Promise.reject(error.response);
    }
  );
};
