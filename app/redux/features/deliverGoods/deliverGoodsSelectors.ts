import type { RootState } from '@/app/redux/store';

export const selectDeliverGoodsList = (state: RootState) => state.deliverGoods.deliverGoodsList;
export const selectDeliverGoods = (state: RootState) => state.deliverGoods.deliverGoods;
export const selectDeliverGoodsLoading = (state: RootState) => state.deliverGoods.loading;
export const selectDeliverGoodsError = (state: RootState) => state.deliverGoods.error;