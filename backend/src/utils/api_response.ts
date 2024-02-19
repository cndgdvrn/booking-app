import { Response } from "express";

class API_RESPONSE<T> {
  public data?: T;
  public message: string;

  constructor(data: T, message: string) {
    this.data = data;
    this.message = message;
  }
  

  public success(res: Response) {
    res.status(200).json({
      success: true,
      message: this.message || "Success - 200",
      data: this.data,
    });
  }

  public created(res: Response) {
    res.status(201).json({
      success: true,
      message: this.message || "Success - 201",
      data: this.data,
    });
  }
}


export default API_RESPONSE