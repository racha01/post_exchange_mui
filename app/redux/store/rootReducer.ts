import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer from '@/app/redux/features/seller/sellerSlice'
// import userReducer from '../features/user/userSlice';
import productReducer from '@/app/redux/features/product/productSlice';
import deliverGoodsReducer from '@/app/redux/features/deliverGoods/deliverGoodsSlice'
// import orderReducer from '../features/order/orderSlice';

const rootReducer = combineReducers({
    seller: sellerReducer,
    product: productReducer,
    deliverGoods: deliverGoodsReducer
});

export default rootReducer;
