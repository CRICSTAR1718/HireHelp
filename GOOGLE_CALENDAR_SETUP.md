# Google Calendar Integration Setup Guide

This document explains how to set up Google Calendar integration for automated interview scheduling with Google Meet links.

## Overview

The system now supports automatic Google Calendar event creation with Google Meet links when scheduling interviews. When an interviewer clicks "Send Invitation", the system:

1. Creates a Google Calendar event
2. Automatically generates a Google Meet link
3. Adds candidate and interviewer as attendees
4. Sends calendar invitations to both parties
5. Stores the event ID and meeting link in the database

## Prerequisites

- Google Workspace account with Calendar API access
- Google Cloud Project with Calendar API enabled
- OAuth 2.0 credentials configured

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Navigate to APIs & Services > Library
   - Search for "Google Calendar API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the consent screen if prompted
4. Choose "Web application" as the application type
5. Add authorized redirect URIs (e.g., `http://localhost:5000/auth/callback`)
6. Copy the Client ID and Client Secret

### 3. Generate Refresh Token

Since we're using a service account approach with a refresh token, you need to generate one:

1. Use the OAuth 2.0 Playground or a similar tool to obtain a refresh token
2. Authorize the application with the required scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
3. Copy the refresh token

### 4. Configure Environment Variables

Add the following to your `.env` file:

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_CALENDAR_ID=primary
```

**Note:** 
- `GOOGLE_CALENDAR_ID` can be `primary` for the user's primary calendar, or a specific calendar ID
- For production, use the actual redirect URI of your application

### 5. Run Database Migration

Apply the database migration to add calendar integration fields:

```bash
cd server
npm run migrate
```

Or manually run the migration file:

```bash
psql -U your_user -d your_database -f database/migrations/0006_add_calendar_integration_fields.sql
```

## Architecture

### Calendar Provider Abstraction

The system uses an abstraction layer to support multiple calendar providers:

```typescript
interface CalendarProvider {
  createMeeting(data: MeetingData): Promise<MeetingResult>;
  updateMeeting(eventId: string, data: Partial<MeetingData>): Promise<void>;
  cancelMeeting(eventId: string): Promise<void>;
}
```

Currently implemented:
- `CompanyGoogleCalendarProvider` - Uses company Google account credentials

Future extensibility:
- `InterviewerGoogleCalendarProvider` - Could use interviewer-specific OAuth tokens
- `OutlookCalendarProvider` - Could add Microsoft Outlook integration

### Database Schema Changes

Added to `schedules` table:
- `google_event_id` - Google Calendar event ID
- `invitation_sent` - Whether calendar invitation was sent
- `calendar_provider` - Calendar provider (google, outlook, etc.)
- `calendar_owner_type` - Type of calendar owner (company, interviewer)
- `calendar_owner_id` - ID of the calendar owner

### API Endpoints

#### Send Invitation
```http
POST /api/interviews/scheduling/:id/send-invite
```

Request body:
```json
{
  "interviewerId": 1,
  "candidateEmail": "candidate@example.com",
  "candidateName": "John Doe",
  "interviewerEmail": "interviewer@example.com",
  "interviewerName": "Jane Smith"
}
```

#### Get Upcoming Interviews
```http
GET /api/interviews/scheduling/upcoming/:candidateId
```

## Usage

### HR/Admin Flow

1. Navigate to Admin Dashboard > Schedule Interview
2. Select candidate and interviewer
3. Choose interview type and mode (in-person/virtual)
4. Set date and time
5. Click "Schedule Interview"
6. For virtual interviews, the system automatically:
   - Creates a Google Calendar event
   - Generates a Google Meet link
   - Sends invitations to both parties

### Interviewer Flow

1. Navigate to Interviewer Dashboard > My Interviews
2. View assigned interviews
3. Click "Send Invitation" on pending interviews
4. System creates calendar event and sends invitations
5. Once invitation sent, "Join Meeting" button appears with Google Meet link

### Candidate Flow

1. Navigate to Candidate Dashboard > Interviews
2. View upcoming interviews
3. See meeting link and calendar invitation status
4. Click "Join Meeting" to access Google Meet

## Testing

### Manual Testing

1. Ensure environment variables are set
2. Create a test interview via admin panel
3. Verify Google Calendar event is created
4. Check that Google Meet link is generated
5. Verify invitations are sent to both parties
6. Test interviewer "Send Invitation" button
7. Verify meeting link appears for candidates

### Automated Testing

Run the test suite:

```bash
npm test
```

## Troubleshooting

### Common Issues

**Error: "Failed to create Google Calendar event"**
- Verify Google credentials are correct
- Check that Calendar API is enabled
- Ensure refresh token is valid

**Error: "Invitation already sent"**
- Each interview can only have one invitation sent
- Check database for existing `invitation_sent = true`

**No meeting link generated**
- Verify `conferenceDataVersion: 1` is set in API call
- Check that Google Meet is enabled for the workspace

### Debug Mode

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

## Security Considerations

- Store Google credentials securely (use environment variables, never commit to git)
- Refresh tokens should be rotated periodically
- Consider using Google Workspace service accounts for production
- Implement proper error handling for API failures
- Add rate limiting to prevent abuse

## Future Enhancements

- Support for interviewer-specific Google accounts
- Calendar conflict detection
- Automatic rescheduling with calendar updates
- Support for multiple calendar providers (Outlook, etc.)
- Email notifications for calendar events
- Integration with video conferencing platforms (Zoom, Teams)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Calendar API documentation
3. Check server logs for detailed error messages
4. Verify database migration was applied correctly
