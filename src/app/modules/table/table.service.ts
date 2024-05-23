import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { Ttable } from "./table.interface";
import { Table } from "./table.model";
import QueryBuilder from "../../builder/QueryBuilder";
const insertTableIntoDb = async (payload: Ttable) => {
  const result = await Table.create(payload);
  return result;
};
const getAllTables = async (query: Record<string, any>) => {
  const tableModel = new QueryBuilder(Table.find().populate("branch"), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await tableModel.modelQuery;
  const meta = await tableModel.countTotal();
  return {
    data,
    meta,
  };
};
const getSingleTable = async (id: string) => {
  const result = await Table.findById(id).populate("branch");
  return result;
};

const updateTable = async (id: string, payload: Partial<Ttable>) => {
  const result = await Table.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const deleteTable = async (id: string) => {
  const result = await Table.findByIdAndDelete(id);
  return result;
};
export const tableServices = {
  insertTableIntoDb,
  getAllTables,
  getSingleTable,
  updateTable,
  deleteTable,
};
