import axios from "axios";

const axiosPublic = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
});
const UseAxiosPublic = () => {
  return axiosPublic;
};

export default UseAxiosPublic;
