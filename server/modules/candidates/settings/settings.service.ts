import { db } from '../../../database';
import { candidateSettings } from '../../../database/schema';
import { eq } from 'drizzle-orm';

export class SettingsService {
  async getSettings(candidateId: number) {
    const settings = await db.select().from(candidateSettings).where(eq(candidateSettings.candidateId, candidateId)).limit(1);
    return settings[0] || this.getDefaultSettings(candidateId);
  }

  async updateEmailPreferences(candidateId: number, preferences: any) {
    const existing = await this.getSettings(candidateId);
    const updated = await db.update(candidateSettings)
      .set({
        jobAlerts: preferences.jobAlerts ?? existing.jobAlerts,
        applicationUpdates: preferences.applicationUpdates ?? existing.applicationUpdates,
        interviewEmails: preferences.interviewEmails ?? existing.interviewEmails,
        marketingEmails: preferences.marketingEmails ?? existing.marketingEmails,
      })
      .where(eq(candidateSettings.candidateId, candidateId))
      .returning();
    return updated[0];
  }

  async updatePrivacySettings(candidateId: number, settings: any) {
    const existing = await this.getSettings(candidateId);
    const updated = await db.update(candidateSettings)
      .set({
        profileVisibility: settings.profileVisibility ?? existing.profileVisibility,
        allowRecruiterDiscovery: settings.allowRecruiterDiscovery ?? existing.allowRecruiterDiscovery,
        includeInTalentPool: settings.includeInTalentPool ?? existing.includeInTalentPool,
      })
      .where(eq(candidateSettings.candidateId, candidateId))
      .returning();
    return updated[0];
  }

  async deleteAccount(candidateId: number) {
    await db.delete(candidateSettings).where(eq(candidateSettings.candidateId, candidateId));
    // Additional cleanup for candidate record would go here
    return { success: true, message: 'Account deleted successfully' };
  }

  private getDefaultSettings(candidateId: number) {
    return {
      candidateId,
      jobAlerts: true,
      applicationUpdates: true,
      interviewEmails: true,
      marketingEmails: false,
      profileVisibility: true,
      allowRecruiterDiscovery: true,
      includeInTalentPool: true,
    };
  }
}

export const settingsService = new SettingsService();
