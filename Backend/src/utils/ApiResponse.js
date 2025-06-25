class ApiResponse {
    constructor(statusCode, data , message = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;
