namespace CampaignService.Dtos
{
    public class ResponseDto<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public int StatusCode { get; set; }

        public static ResponseDto<T> SuccessResponse(T? data, string? message = null, int statusCode = 200)
        {
            return new ResponseDto<T>
            {
                Success = true,
                Message = message,
                Data = data,
                StatusCode = statusCode
            };
        }

        public static ResponseDto<T> FailResponse(string message, int statusCode = 400)
        {
            return new ResponseDto<T>
            {
                Success = false,
                Message = message,
                Data = default,
                StatusCode = statusCode
            };
        }
    }
}
