import Axios from "axios";

export const Api = Axios.create({
    baseURL: 'http://192.168.10.81:3333'
})