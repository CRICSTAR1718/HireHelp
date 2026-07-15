import type { NextFunction, Request, Response } from "express";

import * as approvalsRepository from "./approvals.repository";
import {
  getApprovalById as getApprovalByIdController,
  listApprovals as listApprovalsController,
} from "./approvals.controller";
import {
  approveApproval,
  getApprovalById,
  listApprovals,
  rejectApproval,
} from "./approvals.service";

jest.mock("./approvals.repository", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByRequisitionId: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  updateApprovalCount: jest.fn(),
}));

const mockFindAll = approvalsRepository.findAll as jest.Mock;
const mockFindById = approvalsRepository.findById as jest.Mock;
const mockUpdateStatus = approvalsRepository.updateStatus as jest.Mock;
const mockUpdateApprovalCount = approvalsRepository.updateApprovalCount as jest.Mock;

const baseApproval = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  requisitionId: "req-456",
  status: "pending",
  requiredApprovalCount: "1",
  currentApprovalCount: "0",
  approvedBy: [],
  rejectedBy: null,
  rejectionReason: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const approvalData = {
  id: baseApproval.id,
  requisitionId: baseApproval.requisitionId,
  status: baseApproval.status,
  requiredApprovalCount: baseApproval.requiredApprovalCount,
  currentApprovalCount: baseApproval.currentApprovalCount,
  approvedBy: baseApproval.approvedBy,
  rejectedBy: baseApproval.rejectedBy,
  rejectionReason: baseApproval.rejectionReason,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const createResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("approvals.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists all approvals", async () => {
    mockFindAll.mockResolvedValue([baseApproval]);

    await expect(listApprovals()).resolves.toEqual([approvalData]);
  });

  it("returns an approval by ID", async () => {
    mockFindById.mockResolvedValue(baseApproval);

    await expect(getApprovalById(baseApproval.id)).resolves.toEqual(approvalData);
  });

  it("throws 404 when an approval is not found", async () => {
    mockFindById.mockResolvedValue(undefined);

    await expect(getApprovalById("missing-approval")).rejects.toMatchObject({
      message: "Approval not found",
      statusCode: 404,
    });
  });

  it("approves an approval when status is pending", async () => {
    mockFindById.mockResolvedValue(baseApproval);
    const approvedApproval = {
      ...baseApproval,
      status: "approved",
      currentApprovalCount: "1",
      approvedBy: ["660e8400-e29b-41d4-a716-446655440001"],
    };
    mockUpdateApprovalCount.mockResolvedValue(approvedApproval);
    mockUpdateStatus.mockResolvedValue(approvedApproval);

    const result = await approveApproval(baseApproval.id, "660e8400-e29b-41d4-a716-446655440001");
    expect(result).toBeDefined();
    expect(result.status).toBe("approved");
  });

  it("throws 409 when approving a non-pending approval", async () => {
    const rejectedApproval = {
      ...baseApproval,
      status: "rejected",
    };
    mockFindById.mockResolvedValue(rejectedApproval);

    await expect(approveApproval(baseApproval.id, "660e8400-e29b-41d4-a716-446655440001")).rejects.toMatchObject({
      message: expect.stringContaining("Cannot approve an approval with status"),
      statusCode: 409,
    });
  });

  it("throws 409 when the same user tries to approve twice", async () => {
    const alreadyApprovedApproval = {
      ...baseApproval,
      approvedBy: ["660e8400-e29b-41d4-a716-446655440001"],
    };
    mockFindById.mockResolvedValue(alreadyApprovedApproval);

    await expect(approveApproval(baseApproval.id, "660e8400-e29b-41d4-a716-446655440001")).rejects.toMatchObject({
      message: "User has already approved this approval",
      statusCode: 409,
    });
  });

  it("rejects an approval when status is pending", async () => {
    mockFindById.mockResolvedValue(baseApproval);
    const rejectedApproval = {
      ...baseApproval,
      status: "rejected",
      rejectedBy: "660e8400-e29b-41d4-a716-446655440001",
      rejectionReason: "Not suitable",
    };
    mockUpdateStatus.mockResolvedValue(rejectedApproval);

    const result = await rejectApproval(baseApproval.id, "660e8400-e29b-41d4-a716-446655440001", "Not suitable");
    expect(result).toBeDefined();
    expect(result.status).toBe("rejected");
  });

  it("throws 409 when rejecting a non-pending approval", async () => {
    const approvedApproval = {
      ...baseApproval,
      status: "approved",
    };
    mockFindById.mockResolvedValue(approvedApproval);

    await expect(
      rejectApproval(baseApproval.id, "660e8400-e29b-41d4-a716-446655440001", "Test reason")
    ).rejects.toMatchObject({
      message: expect.stringContaining("Cannot reject an approval with status"),
      statusCode: 409,
    });
  });
});

describe("approvals.controller", () => {
  it("lists approvals via controller", async () => {
    mockFindAll.mockResolvedValue([baseApproval]);

    const req = {} as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await listApprovalsController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [approvalData] });
  });

  it("gets an approval by ID via controller", async () => {
    mockFindById.mockResolvedValue(baseApproval);

    const req = { params: { id: baseApproval.id } } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    await getApprovalByIdController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: approvalData });
  });
});

