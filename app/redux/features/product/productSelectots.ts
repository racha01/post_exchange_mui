import type { RootState } from '@/app/redux/store';

export const selectSellerList = (state: RootState) => state.seller.sellerList;
export const selectSeller = (state: RootState) => state.seller.seller;
export const selectSellerLoading = (state: RootState) => state.seller.loading;
export const selectSellerError = (state: RootState) => state.seller.error;