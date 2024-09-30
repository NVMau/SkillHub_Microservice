import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

// Hàm đăng ký người dùng mới
// Hàm đăng ký người dùng mới
export const submitOrder = async (amount, profileId) => {
    return await httpClient.post(`${API.PAYMENT}?amount=${amount}&profileId=${profileId}`
    );
};