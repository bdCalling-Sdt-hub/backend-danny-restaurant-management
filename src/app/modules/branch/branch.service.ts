import { TBranch } from "./branch.interface";
import { Branch } from "./branch.model";

const insertBranchIntoDB = async (payload: TBranch) => {
  console.log(payload);
  const result = await Branch.create(payload);
  return result;
};

const getAllBranch = async () => {
  const result = await Branch.find();
  return result;
};

const getSingleBranch = async (id: string) => {
  const result = await Branch.findById(id);
  return result;
};

const updateBranch = async (id: string, payload: Partial<TBranch>) => {
  const result = await Branch.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const branchservices = {
  insertBranchIntoDB,
  getAllBranch,
  getSingleBranch,
  updateBranch,
};
