import axios from "axios";
import { BASEURL } from "./constants";

export const getUser = async ()=>{
    const {data} = await axios.get(`${BASEURL}/profile/view`, {withCredentials : true});
    return data;
}
