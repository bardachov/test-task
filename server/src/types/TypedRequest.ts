import { Request } from "express";
type TypedRequest<T> = Request & T;

export default TypedRequest;