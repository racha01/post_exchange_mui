// import { Pagination } from '@/app/interfaces/api/common';
// import { GetDeliverGoods } from '@/app/interfaces/api/deliverGoods';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface ApiState {
//     data: Pagination<GetDeliverGoods> | null;
//     loading: boolean;
//     error: string | null;
// }

// const initialState: ApiState = {
//     data: null,
//     loading: false,
//     error: null,
// };

// export const fetchDeliverGoodsDatas = createAsyncThunk('api/deliver-goods', async (url: string, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(url);
//         const datas = response.data;
//         return response.data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data || 'Something went wrong');
//     }
// });

// export const fetchDeliverGoodsData = createAsyncThunk('api/deliver-goods', async (url: string, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data || 'Something went wrong');
//     }
// });

// const apiDeliverGoodsSlice = createSlice({
//     name: 'fetchDeliverGoodsDatas',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchDeliverGoodsDatas.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchDeliverGoodsDatas.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.data = action.payload;
//             })
//             .addCase(fetchDeliverGoodsDatas.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// export default apiDeliverGoodsSlice.reducer;