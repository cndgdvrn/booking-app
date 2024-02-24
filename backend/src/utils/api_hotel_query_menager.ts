import mongoose from "mongoose";
import { Request } from "express";
import { IHotel, IHotelQueryOptions } from "../types/types";
import Hotel from "../models/hotel";
import API_ERROR from "./api_error";

class API_HOTEL_QUERY_MANAGER {
  private query: mongoose.FilterQuery<IHotel>;
  private options: IHotelQueryOptions;

  constructor(req: Request) {
    this.options = this.getQueryOptions(req);
    this.query = this.buildQuery();
  }

  private getQueryOptions(req: Request): IHotelQueryOptions {
    const qOptions: Partial<IHotelQueryOptions> = {};

    Object.entries(req.query).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case "name":
        case "city":
        case "country":
        case "type":
        case "sortBy":
        case "sortOrder":
          if (typeof value === "string") {
            qOptions[key] = value;
          }
          break;
        case "minPrice":
        case "maxPrice":
        case "adultCount":
        case "childCount":
        case "starRating":
        case "page":
        case "limit":
          if (!Array.isArray(value) && !isNaN(Number(value))) {
            qOptions[key] = Number(value);
          }
          break;
        case "facilities":
          if (typeof value === "string") {
            qOptions.facilities = value.split(",");
          } else if (Array.isArray(value)) {
            qOptions.facilities = value.map((dt) => (typeof dt === "string" ? dt : ""));
          }
          break;
      }
    });

    return qOptions as IHotelQueryOptions;
  }

  private buildQuery() {
    const bQuery: mongoose.FilterQuery<IHotel> = {};

    if (this.options.name) {
      const nameKeywords = this.options.name.split("+").filter(Boolean);
      const regexPattern = nameKeywords.map((keyword) => `(?=.*${keyword})`).join("");
      bQuery.name = { $regex: new RegExp(regexPattern, "i") };
    }
    if (this.options.city) {
      bQuery.city = this.options.city;
    }
    if (this.options.country) {
      bQuery.country = this.options.country;
    }
    if (this.options.type) {
      bQuery.type = this.options.type;
    }
    if (this.options.maxPrice) {
      bQuery.pricePerNight = { ...bQuery.pricePerNight, $lte: Number(this.options.maxPrice) };
    }
    if (this.options.minPrice) {
      bQuery.pricePerNight = { ...bQuery.pricePerNight, $gte: Number(this.options.minPrice) };
    }
    if (this.options.adultCount) {
      bQuery.adultCount = Number(this.options.adultCount);
    }
    if (this.options.childCount) {
      bQuery.childCount = Number(this.options.childCount);
    }
    if (this.options.starRating) {
      bQuery.starRating = Number(this.options.starRating);
    }
    if (this.options.facilities) {
      bQuery.facilities = { $all: this.options.facilities };
    }

    return bQuery;
  }

  async sortAndPaginate() {
    const sortBy = this.options.sortBy || "pricePerNight";
    const sortOrder = this.options.sortOrder === "asc" ? 1 : -1;
    const currentPage = Math.max(this.options.page || 1, 1);
    const limit = Math.max(this.options.limit || 10, 1);

    const numOfHotels = await Hotel.find(this.query).countDocuments();

    const hotels = await Hotel.find(this.query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((currentPage - 1) * limit);

    const totalNumberOfHotels = Math.max(numOfHotels || 0, 0);
    const totalPages = Math.ceil(totalNumberOfHotels / limit);

    if (totalPages < currentPage) {
      throw new API_ERROR("Total number of pages must be greater than the current page number.", 400);
    }

    return {
      totalPages,
      currentPage,
      totalNumberOfHotels,
      hotels,
    };
  }
}

export default API_HOTEL_QUERY_MANAGER;
