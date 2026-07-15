import { AppError } from "../../../common/middleware/error-handler";
import { findAll, findByKey, upsertByKey, type Configuration } from "./configuration.repository";
import type { UpdateConfigurationInput } from "./configuration.schema";

export type ConfigurationData = { key: string; value: string; description: string | null; updatedBy: string | null; updatedAt: string };
const toData = (item: Configuration): ConfigurationData => ({ key: item.key, value: item.value, description: item.description, updatedBy: item.updatedBy, updatedAt: item.updatedAt.toISOString() });
export const listConfiguration = async (): Promise<ConfigurationData[]> => (await findAll()).map(toData);
export const updateConfiguration = async (input: UpdateConfigurationInput, updatedBy?: string): Promise<ConfigurationData> => {
  const existing = await findByKey(input.key);
  if (!existing) throw new AppError("Configuration not found", 404);
  return toData(await upsertByKey({ key: input.key, value: input.value, description: input.description ?? existing.description, updatedBy: updatedBy ?? null }));
};