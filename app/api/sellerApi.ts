import axios from '@/app/api/axiosInterface';
const enpoit: string = '/sellers';


export const fetchSellers = async () => {
    const response = await axios.get(enpoit);
    return response.data;
};

export const fetchSellerById = async (id: string) => {
    const response = await axios.get(enpoit);
    return response.data;
};

export const createUser = async (userData: any) => {
    const response = await axios.post(enpoit, userData);
    return response.data;
};