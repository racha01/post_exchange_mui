import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiErrorException, initialState } from './DeliverGoodsType';
import { DeliverGoodQueryParam, GetDeliverGoods, UpdateDeliverGoods } from '@/app/interfaces/api/deliverGoods';
import { ApiErrorException, Pagination } from '@/app/interfaces/api/common';
const API_URL = 'https://localhost:7287/api/deliver-goods'
export const fetchDeliverGoodsDatas = createAsyncThunk('api/deliver-goods',
    async (param: DeliverGoodQueryParam, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                params: {
                    seller_id: param.sellerId,
                    start_date: param.startDate,
                    end_date: param.endDate,
                    page_no: param.pageNo,
                    page_size: param.pageSize
                }
            });
            const datas = response.data;
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    });

export const fetchDeliverGoodsData = createAsyncThunk('api/deliver-goods', async (url: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Something went wrong');
    }
});

export const fetchDeliverGoodsById = createAsyncThunk<GetDeliverGoods, string>('api/deliver-goods/id', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data as GetDeliverGoods;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Something went wrong');
    }
});

export const createDeliverGoods = createAsyncThunk<GetDeliverGoods, UpdateDeliverGoods>('api/deliver-goods/create', async (newDeliverGoods, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, newDeliverGoods);
        console.log("response")
        console.log(response)
        const resDeliverGoods = await axios.get(`${API_URL}/${response.data.id}`);

        const product: GetDeliverGoods = {
            id: response.data.id,
            seller_code: resDeliverGoods.data.seller_code,
            seller_name: resDeliverGoods.data.seller_name,
            product_id: resDeliverGoods.data.product_id,
            product_code: resDeliverGoods.data.product_code,
            product_name: resDeliverGoods.data.product_name,
            wholesale_price: resDeliverGoods.data.wholesale_price,
            cash_price: resDeliverGoods.data.cash_price,
            accruals_price: resDeliverGoods.data.accruals_price,
            amount: resDeliverGoods.data.amount,
            leftovers: resDeliverGoods.data.leftovers,
            deliver_good_date: resDeliverGoods.data.deliver_good_date,
            create_info: {
                timestamp: resDeliverGoods.data.create_info.timestamp,
                user_id: resDeliverGoods.data.create_info.user_id,
                user_name: resDeliverGoods.data.create_info.user_name
            },
            update_info: {
                timestamp: resDeliverGoods.data.update_info.timestamp,
                user_id: resDeliverGoods.data.update_info.user_id,
                user_name: resDeliverGoods.data.update_info.user_name
            }
        }
        return product as GetDeliverGoods;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});

export const updateDeliverGoodsStore = createAsyncThunk('api/deliver-goods/update', async ({ id, updateDeliverGoods }: { id: string; updateDeliverGoods: UpdateDeliverGoods }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updateDeliverGoods);

        const responseGetData = await axios.get(API_URL);
        const datas = responseGetData.data;
        return datas;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});
export const deleteDeliverGoodsStore = createAsyncThunk('api/deliver-goods/delete', async (id: string, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        // const responseGetData = await axios.get(API_URL);
        // const datas = responseGetData.data;
        // return datas;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || apiErrorException);
    }
});

const apiDeliverGoodsSlice = createSlice({
    name: 'fetchDeliverGoodsDatas',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliverGoodsDatas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliverGoodsDatas.fulfilled, (state, action) => {
                state.loading = false;
                state.deliverGoodsList = action.payload;
            })
            .addCase(fetchDeliverGoodsDatas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            .addCase(fetchDeliverGoodsById.fulfilled, (state, action) => {
                state.loading = false;
                state.deliverGoods = action.payload as GetDeliverGoods;
            })
            .addCase(fetchDeliverGoodsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            .addCase(createDeliverGoods.fulfilled,
                (state, action: PayloadAction<GetDeliverGoods>) => {
                    state.loading = false;
                    // state.deliverGoodsList?.items.push(action.payload)
                })
            .addCase(createDeliverGoods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            .addCase(updateDeliverGoodsStore.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.deliverGoodsList = action.payload as Pagination<GetDeliverGoods>
                })
            .addCase(updateDeliverGoodsStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
            .addCase(deleteDeliverGoodsStore.fulfilled,
                (state) => {
                    state.loading = false;
                    // state.deliverGoodsList = action.payload as Pagination<GetDeliverGoods>
                })
            .addCase(deleteDeliverGoodsStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiErrorException;
            })
    },
});

export default apiDeliverGoodsSlice.reducer;