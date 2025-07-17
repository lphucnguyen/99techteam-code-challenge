export default class Pagination<T> {
    constructor(public data: T[], public pagination: {
        total: number,
        totalPages: number,
        currentPage: number
    }) {}
}