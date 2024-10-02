import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const source = axios.CancelToken.source();

axios.post('/api/endpoint', { data: 'yourData' }, {
    cancelToken: source.token,
}).then(response => {
    console.log('Success:', response.data);
}).catch(thrown => {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        console.error('Error:', thrown);
    }
});


source.cancel('Operation canceled by the user.');
export default axios;