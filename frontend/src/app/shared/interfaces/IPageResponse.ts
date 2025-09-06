export interface IPageResponse<T> {
  data: T;
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
