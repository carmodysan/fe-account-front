import store from "./index";
import axiosInstance from '../services/FEApiService';

store.subscribe((mutation) => {
    switch (mutation.type) {
        case 'auth/setToken':
            if (mutation.payload) {
                axiosInstance.defaults.headers.common['Authorization'] = `BEARER ${mutation.payload}`
                localStorage.setItem('token', mutation.payload)
            } else {
                axiosInstance.defaults.headers.common['Authorization'] = null
                localStorage.setItem('token', mutation.payload)
                localStorage.removeItem('token')
            }
            break;
    
        default:
            break;
    }
})