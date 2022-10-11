
import axios from 'axios';

const baseURL = 'http://localhost:8080';

const AxiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
		'Access-Control-Allow-Origin': "*",
        "Access-Control-Allow-Private-Network": true
	},
});

export default AxiosInstance;