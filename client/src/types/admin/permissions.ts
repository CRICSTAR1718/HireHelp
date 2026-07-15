export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionInput {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionInput {
  name?: string;
  resource?: string;
  action?: string;
  description?: string | null;
}
