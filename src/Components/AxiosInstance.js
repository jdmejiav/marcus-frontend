
import axios from 'axios';

const baseURL = 'http://20.7.2.215:8080/';


const AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})


export default AxiosInstance;