export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  description?: string | null;
}
