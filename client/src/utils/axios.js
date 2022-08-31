import axios from "axios";
import appConfig from "../config/config";

const instance = axios.create({
  baseURL: appConfig.backendUrl,
});

export default instance;
