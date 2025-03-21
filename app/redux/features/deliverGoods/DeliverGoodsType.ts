import { ApiErrorException, Pagination } from "@/app/interfaces/api/common";
import { defaultDeliverGoods, GetDeliverGoods } from "@/app/interfaces/api/deliverGoods";

export interface ApiState {
    deliverGoodsList: Pagination<GetDeliverGoods> | null;
    deliverGoods: GetDeliverGoods;
    loading: boolean;
    error: ApiErrorException | null;
}

export const initialState: ApiState = {
    deliverGoodsList: null,
    deliverGoods: defaultDeliverGoods,
    loading: false,
    error: null,
};

export const apiErrorException: ApiErrorException = {
    status: 404,
    detail: "Something went wrong",
    instance: ""
}