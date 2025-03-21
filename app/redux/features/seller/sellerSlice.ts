import { ApiErrorException, Pagination } from '@/app/interfaces/api/common';
import { CreateSeller, Seller, SellerList, UpdateSeller } from '@/app/interfaces/api/sellser';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
const API_URL = "https://localhost:7287/api/sellers";
const BASE_URL = "https://localhost:7287";

const apiErrorException: ApiErrorException = {
    status: 404,
    detail: "Something went wrong",
    instance: ""
}

interface ApiState {
    sellerList: Pagination<Seller> | null;
    seller: Seller;
    loading: boolean;
    error: ApiErrorException | null;
}

const initialState: ApiState = {
    sellerList: null,
    seller: { id: '', seller_code: '', seller_name: '' },
    loading: false,
    error: null,
};

export const fetchSellerDatas = createAsyncThunk('api/sellers', async (url: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(url);
        const datas = response.data;
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});

export const fetchSellerData = createAsyncThunk<Seller, string>('api/seller', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);

        return response.data as Seller;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});

export const createSeller = createAsyncThunk<Seller, CreateSeller>('api/sellers/create', async (newSeller, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, newSeller);

        // const seller = await axios.get(`${API_URL}/${response.data.id}`);
        const seller: Seller = {
            id: response.data.id,
            seller_code: newSeller.seller_code,
            seller_name: newSeller.seller_name
        }
        return seller as Seller;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});

export const updateSeller = createAsyncThunk('api/sellers/update', async ({ id, updateSeller }: { id: string; updateSeller: UpdateSeller }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updateSeller);

        const responseGetData = await axios.get(API_URL);
        const datas = responseGetData.data;
        return datas;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});

const sellersSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerDatas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerDatas.fulfilled, (state, action) => {
                state.loading = false;
                state.sellerList = action.payload;
            })
            .addCase(fetchSellerDatas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            .addCase(createSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSeller.fulfilled,
                (state, action: PayloadAction<Seller>) => {
                    state.loading = false;
                    state.sellerList?.items.push(action.payload)
                })
            .addCase(createSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            // .addCase(fetchSellerData.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchSellerData.fulfilled, (state, action) => {
                state.loading = false;
                state.seller = action.payload as Seller;
            })
            .addCase(fetchSellerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            .addCase(updateSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSeller.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.sellerList = action.payload as Pagination<Seller>
                })
            .addCase(updateSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })

    },
});

export default sellersSlice.reducer;