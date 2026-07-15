import type { NextFunction, Request, Response } from "express";

import * as departmentsRepository from "./departments.repository";
import * as departmentsService from "./departments.service";
import {
  createDepartment as createDepartmentController,
  deleteDepartment as deleteDepartmentController,
  listDepartments as listDepartmentsController,
} from "./departments.controller";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  listDepartments,
  updateDepartment,
} from "./departments.service";

jest.mock("./departments.repository", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByParentId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}));

const mockFindAll = departmentsRepository.findAll as jest.Mock;
const mockFindById = departmentsRepository.findById as jest.Mock;
const mockCreate = departmentsRepository.create as jest.Mock;
const mockUpdate = departmentsRepository.update as jest.Mock;
const mockDeleteById = departmentsRepository.deleteById as jest.Mock;

const baseDepartment = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Engineering",
  description: "Product engineering",
  parentDepartmentId: null,
  headUserId: null,
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const departmentData = {
  ...baseDepartment,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const createResponse = () => {
  const response = { status: jest.fn(), json: jest.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("departments.service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lists safe department response objects", async () => {
    mockFindAll.mockResolvedValue([baseDepartment]);
    await expect(listDepartments()).resolves.toEqual([departmentData]);
  });

  it("returns a department and reports missing departments", async () => {
    mockFindById.mockResolvedValueOnce(baseDepartment).mockResolvedValueOnce(undefined);
    await expect(getDepartmentById(baseDepartment.id)).resolves.toEqual(departmentData);
    await expect(getDepartmentById("missing")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("creates a department when its name is available", async () => {
    mockFindAll.mockResolvedValue([]);
    mockCreate.mockResolvedValue(baseDepartment);
    await expect(createDepartment({ name: "Engineering" })).resolves.toEqual(departmentData);
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ name: "Engineering", isActive: true }));
  });

  it("rejects duplicate department names", async () => {
    mockFindAll.mockResolvedValue([baseDepartment]);
    await expect(createDepartment({ name: "engineering" })).rejects.toMatchObject({ statusCode: 409 });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("updates an existing department", async () => {
    mockFindById.mockResolvedValue(baseDepartment);
    mockFindAll.mockResolvedValue([baseDepartment]);
    mockUpdate.mockResolvedValue({ ...baseDepartment, description: "Updated" });
    await expect(updateDepartment(baseDepartment.id, { description: "Updated" })).resolves.toMatchObject({ description: "Updated" });
  });

  it("soft deletes an active department", async () => {
    mockFindById.mockResolvedValue(baseDepartment);
    mockDeleteById.mockResolvedValue({ ...baseDepartment, isActive: false });
    await expect(deleteDepartment(baseDepartment.id)).resolves.toEqual({ message: "Department deleted successfully" });
    expect(mockDeleteById).toHaveBeenCalledWith(baseDepartment.id);
  });
});

describe("departments.controller", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns a success data envelope when listing departments", async () => {
    jest.spyOn(departmentsService, "listDepartments").mockResolvedValue([departmentData]);
    const response = createResponse();
    await listDepartmentsController({} as Request, response, jest.fn() as NextFunction);
    expect(response.json).toHaveBeenCalledWith({ success: true, data: [departmentData] });
  });

  it("returns success envelopes for create and delete", async () => {
    jest.spyOn(departmentsService, "createDepartment").mockResolvedValue(departmentData);
    jest.spyOn(departmentsService, "deleteDepartment").mockResolvedValue({ message: "Department deleted successfully" });
    const createResponseMock = createResponse();
    await createDepartmentController({ body: { name: "Engineering" } } as Request, createResponseMock, jest.fn() as NextFunction);
    expect(createResponseMock.json).toHaveBeenCalledWith({ success: true, data: departmentData });

    const deleteResponseMock = createResponse();
    await deleteDepartmentController({ params: { id: baseDepartment.id } } as unknown as Request, deleteResponseMock, jest.fn() as NextFunction);
    expect(deleteResponseMock.json).toHaveBeenCalledWith({ success: true, message: "Department deleted successfully" });
  });
});