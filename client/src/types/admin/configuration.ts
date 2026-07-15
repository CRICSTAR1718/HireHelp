export interface Configuration {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

export interface UpdateConfigurationInput {
  key: string;
  value: string;
}
