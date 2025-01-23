import axios from "axios";
import {UserDTO} from "../../redux/user/types.ts";
import {GET_USER} from "./config.ts";

export const getUser = async (userId: string) => {
    const config = {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    }
    const response = await axios.get<UserDTO>(`${GET_USER}/${userId}`, config)
    return response.data;
}