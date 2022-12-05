
import axios from 'axios';

const baseURL = 'http://172.20.0.193:8080/';


const AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})


export default AxiosInstance;