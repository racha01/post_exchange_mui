// import { ApiErrorException, Pagination } from '@/app/interfaces/api/common';
// import { GetProduct, UpdateProduct } from '@/app/interfaces/api/product';
// import { CreateSeller, Seller, SellerList, UpdateSeller } from '@/app/interfaces/api/sellser';
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios, { AxiosRequestConfig } from 'axios';
// const API_URL = "https://localhost:7287/api/products";

// const apiErrorException: ApiErrorException = {
//     status: 404,
//     detail: "Something went wrong",
//     instance: ""
// }

// interface ApiState {
//     data: Pagination<GetProduct> | null;
//     productData: GetProduct;
//     loading: boolean;
//     error: ApiErrorException | null;
// }

// const initialState: ApiState = {
//     data: null,
//     productData: {
//         id: '',
//         seller_id: '',
//         seller_code: '',
//         seller_name: '',
//         product_code: '',
//         product_name: '',
//         wholesale_price: 0,
//         cash_price: 0,
//         accruals_price: 0,
//         create_info: {
//             timestamp: '',
//             user_id: '',
//             user_name: ''
//         },
//         update_info: {
//             timestamp: '',
//             user_id: '',
//             user_name: ''
//         }
//     },
//     loading: false,
//     error: null,
// };

// export const fetchProductDatas = createAsyncThunk('api/sellers', async (_, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(API_URL);
//         return response.data;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data || apiErrorException);
//     }
// });

// export const fetchProductById = createAsyncThunk<Seller, string>('api/seller', async (id, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(`${API_URL}/${id}`);

//         return response.data as Seller;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data || apiErrorException);
//     }
// });

// export const createProduct = createAsyncThunk<GetProduct, UpdateProduct>('api/sellers/create', async (newProduct, { rejectWithValue }) => {
//     try {
//         const response = await axios.post(API_URL, newProduct);

//         const resProduct = await axios.get(`${API_URL}/${response.data.id}`);

//         const product: GetProduct = {
//             id: response.data.id,
//             seller_id: resProduct.data.seller_id,
//             seller_code: resProduct.data.seller_code,
//             seller_name: resProduct.data.seller_name,
//             product_code: resProduct.data.product_code,
//             product_name: resProduct.data.product_name,
//             wholesale_price: resProduct.data.wholesale_price,
//             cash_price: resProduct.data.cash_price,
//             accruals_price: resProduct.data.accruals_price,
//             create_info: {
//                 timestamp: resProduct.data.timestamp,
//                 user_id: resProduct.data.user_id,
//                 user_name: resProduct.data.user_name
//             },
//             update_info: {
//                 timestamp: resProduct.data.timestamp,
//                 user_id: resProduct.data.user_id,
//                 user_name: resProduct.data.user_name
//             }
//         }
//         return product as GetProduct;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data || apiErrorException);
//     }
// });

// export const updateProduct = createAsyncThunk('api/sellers/update', async ({ id, updateSeller }: { id: string; updateSeller: UpdateSeller }, { rejectWithValue }) => {
//     try {
//         const response = await axios.put(`${API_URL}/${id}`, updateSeller);

//         const responseGetData = await axios.get(API_URL);
//         const datas = responseGetData.data;
//         return datas;
//     } catch (error: any) {
//         return rejectWithValue(error.response?.data || apiErrorException);
//     }
// });

// const sellersSlice = createSlice({
//     name: 'seller',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchProductDatas.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProductDatas.fulfilled, (state, action) => {
//                 state.loading = false;
//                 console.log("fgg")
//                 state.data = action.payload;
//             })
//             .addCase(fetchProductDatas.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as ApiErrorException;
//             })
//             .addCase(createProduct.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(createProduct.fulfilled,
//                 (state, action: PayloadAction<GetProduct>) => {
//                     state.loading = false;
//                     state.data?.items.push(action.payload)
//                 })
//             .addCase(createProduct.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as ApiErrorException;
//             })
//             .addCase(fetchProductById.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProductById.fulfilled, (state, action) => {
//                 state.productData = action.payload as GetProduct;
//                 console.log(state.productData)
//             })
//             .addCase(fetchProductById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as ApiErrorException;
//             })
//             .addCase(updateProduct.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updateProduct.fulfilled,
//                 (state, action) => {
//                     state.loading = false;
//                     state.data = action.payload as Pagination<GetProduct>
//                 })
//             .addCase(updateProduct.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as ApiErrorException;
//             })

//     },
// });

// export default sellersSlice.reducer;