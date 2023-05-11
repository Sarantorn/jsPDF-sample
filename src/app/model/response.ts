export class ResponseApi<T> {
    code: string | undefined;
    message: string| undefined;
    data: T | undefined
}

/**
 * @remarks This method return `items` array of `T`
 */
export class ResponseEntity<T> {
    items: Array<T> | undefined;
    pagination?: any;
}

/**
 * @remarks generate map class provide `key` is string
 * @param T type of data
 */
export class ResponseMap<T> {
    data: Map<string, T> | undefined;
}
