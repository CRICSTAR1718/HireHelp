import type { NextFunction, Request, Response } from "express";
import * as configurationService from "./configuration.service";
import type { UpdateConfigurationInput } from "./configuration.schema";
import type { ConfigurationData } from "./configuration.service";
type ListResponse = { success: true; data: ConfigurationData[] };
type ItemResponse = { success: true; data: ConfigurationData };
export const listConfiguration = async (_req: Request, res: Response<ListResponse>, next: NextFunction): Promise<void> => { try { res.status(200).json({ success: true, data: await configurationService.listConfiguration() }); } catch (error) { next(error); } };
export const updateConfiguration = async (req: Request<object, ItemResponse, UpdateConfigurationInput>, res: Response<ItemResponse>, next: NextFunction): Promise<void> => { try { res.status(200).json({ success: true, data: await configurationService.updateConfiguration(req.body, req.user?.userId) }); } catch (error) { next(error); } };