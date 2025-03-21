export interface Pagination<T> {
    total_records: number
    page_no: number
    page_size: number
    total_pages: number
    has_previous_page: boolean
    has_next_page: boolean
    items: T[]
}

export interface CreateInfo {
    timestamp: string | null;
    user_id: string | null;
    user_name: string | null;
}

export interface UpdateInfo {
    timestamp: string | null;
    user_id: string | null;
    user_name: string | null;
}

export interface ApiErrorException {
    status: number,
    detail: string,
    instance: string
}