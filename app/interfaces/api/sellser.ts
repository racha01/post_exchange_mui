
export interface Seller {
    id: string
    seller_code: string
    seller_name: string
}

export interface CreateSeller {
    seller_code: string
    seller_name: string
}

export interface UpdateSeller {
    seller_code: string
    seller_name: string
}

export type SellerList = Seller[];

export interface GetSellerDropDown {
    label: string
    value: string
}
export type GetSellerDropDownList = GetSellerDropDown[];
