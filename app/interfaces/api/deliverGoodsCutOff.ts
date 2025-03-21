export interface DeliverGoodsCusOff {
    seller_id: string
    seller_code: string
    seller_name: string
    total_cost: number
    total_cash_price: number
    total_accruals_price: number
    net_profit_cash_price: number
    net_profit_accruals_price: number
}

export interface SumCusOff {
    sum_total_cost: number
    sum_total_cash_price: number
    sum_total_accruals_price: number
    sum_net_profit_cash_price: number
    sum_net_profit_accruals_price: number
}

export type DeliverGoodsCusOffList = DeliverGoodsCusOff[];