# Backend API Documentation

## 1. Introduction

This document provides the necessary information for frontend developers and other services to integrate with our backend systems. The API provides access to patient data, doctor information, messaging services, health vitals, and more.

**Base URL:** `https://api.baseurl.com/v1`

## 2. Authentication

All API requests must be authenticated. We use token-based authentication (e.g., JWT - JSON Web Tokens).

**Authentication Flow:**
1.  The client authenticates with a username and password via the `/auth/login` endpoint.
2.  Upon successful authentication, the API returns an access token.
3.  This access token must be included in the `Authorization` header for all subsequent requests to protected endpoints, prefixed with `Bearer `.

**Example Header:**
`Authorization: Bearer <your_access_token>`

**Endpoints:**
*   `POST /auth/login`: Authenticates a user and returns an access token.
*   `POST /auth/signup`: Registers a new user.
*   `POST /auth/refresh-token`: (Optional) Allows obtaining a new access token using a refresh token.
*   `POST /auth/logout`: Invalidates the current session/token.

## 3. API Endpoints

Below are the primary API endpoints. Replace `{id}` with the specific resource identifier.

### 3.1. Users (Patients/Doctors)

*   **`GET /users/me`**
    *   Description: Retrieves the profile of the currently authenticated user.
    *   Response: `200 OK` - User object.
*   **`PUT /users/me`**
    *   Description: Updates the profile of the currently authenticated user.
    *   Request Body: User object with fields to update.
    *   Response: `200 OK` - Updated user object.

### 3.2. Patients

*   **`GET /patients`**
    *   Description: Retrieves a list of patients (access may be restricted based on user role).
    *   Query Parameters:
        *   `search`: (string) Search term for patient name or ID.
        *   `page`: (integer) Page number for pagination.
        *   `limit`: (integer) Number of items per page.
    *   Response: `200 OK` - Paginated list of patient objects.
*   **`POST /patients`**
    *   Description: Creates a new patient record.
    *   Request Body: Patient object (see Data Models).
    *   Response: `201 Created` - Newly created patient object.
*   **`GET /patients/{id}`**
    *   Description: Retrieves a specific patient by their ID.
    *   Response: `200 OK` - Patient object. `404 Not Found` if patient does not exist.
*   **`PUT /patients/{id}`**
    *   Description: Updates an existing patient's information.
    *   Request Body: Patient object with fields to update.
    *   Response: `200 OK` - Updated patient object.
*   **`DELETE /patients/{id}`**
    *   Description: Deletes a patient record (soft delete recommended).
    *   Response: `204 No Content`.

### 3.3. Doctors

*   **`GET /doctors`**
    *   Description: Retrieves a list of doctors.
    *   Query Parameters:
        *   `specialty`: (string) Filter by specialty.
        *   `page`: (integer) Page number for pagination.
        *   `limit`: (integer) Number of items per page.
    *   Response: `200 OK` - Paginated list of doctor objects.
*   **`GET /doctors/{id}`**
    *   Description: Retrieves a specific doctor by their ID.
    *   Response: `200 OK` - Doctor object. `404 Not Found` if doctor does not exist.

### 3.4. Health Vitals

*   **`GET /patients/{patientId}/vitals`**
    *   Description: Retrieves health vitals for a specific patient.
    *   Query Parameters:
        *   `type`: (string, e.g., `ecg`, `heartRate`, `bloodPressure`) Filter by vital type.
        *   `startDate`: (date-time) Start date for a time range query.
        *   `endDate`: (date-time) End date for a time range query.
    *   Response: `200 OK` - List of vital records.
*   **`POST /patients/{patientId}/vitals`**
    *   Description: Adds a new health vital record for a patient.
    *   Request Body: Vital record object (see Data Models).
    *   Response: `201 Created` - Newly created vital record.

### 3.5. Messaging

*   **`GET /messages/contacts`**
    *   Description: Retrieves a list of message contacts for the authenticated user.
    *   Response: `200 OK` - List of contact objects.
*   **`GET /messages/{contactId}`**
    *   Description: Retrieves the message history with a specific contact.
    *   Query Parameters:
        *   `page`: (integer) Page number for pagination.
        *   `limit`: (integer) Number of items per page.
    *   Response: `200 OK` - Paginated list of message objects.
*   **`POST /messages/{contactId}`**
    *   Description: Sends a new message to a contact.
    *   Request Body: `{ "content": "Your message here" }`
    *   Response: `201 Created` - Newly created message object.
*   **`GET /messages/unread-count`**
    *   Description: Retrieves the count of unread messages for the authenticated user.
    *   Response: `200 OK` - `{ "unreadCount": 5 }`

### 3.6. Notifications

*   **`GET /notifications`**
    *   Description: Retrieves notifications for the authenticated user.
    *   Query Parameters:
        *   `status`: (string, e.g., `read`, `unread`) Filter by notification status.
    *   Response: `200 OK` - List of notification objects.
*   **`POST /notifications/{id}/mark-as-read`**
    *   Description: Marks a specific notification as read.
    *   Response: `200 OK`.
*   **`POST /notifications/mark-all-as-read`**
    *   Description: Marks all unread notifications as read.
    *   Response: `200 OK`.

### 3.7. Appointments

*   **`GET /appointments`**
    *   Description: Retrieves appointments for the authenticated user (patient or doctor).
    *   Query Parameters: `startDate`, `endDate`, `status`.
    *   Response: `200 OK` - List of appointment objects.
*   **`POST /appointments`**
    *   Description: Creates a new appointment.
    *   Request Body: Appointment object.
    *   Response: `201 Created`.

## 4. Data Models

This section describes the primary data structures used in API requests and responses.

### 4.1. User

```json
{
  "id": "string (uuid)",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string ('patient', 'doctor', 'admin')",
  "avatarUrl": "string (url)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
  // Additional fields based on role
}
```

### 4.2. Patient

```json
{
  "id": "string (uuid)",
  "userId": "string (uuid, foreign key to User)", // If users and patients are separate entities linked
  "name": "string", // Or inherit from User
  "dateOfBirth": "date",
  "gender": "string ('Male', 'Female', 'Other')",
  "contactInfo": {
    "phone": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    }
  },
  "medicalHistorySummary": "string",
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  },
  "status": "string ('normal', 'warning', 'critical')", // Health status
  "location": { // For in-hospital tracking, etc.
      "address": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "coordinates": { "lat": "number", "lng": "number" },
      "inHospital": "boolean"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4.3. Doctor

```json
{
  "id": "string (uuid)",
  "userId": "string (uuid, foreign key to User)",
  "name": "string", // Or inherit from User
  "specialty": "string",
  "qualifications": ["string"],
  "yearsOfExperience": "integer",
  "consultationFee": "number",
  "availability": [ // Schedule
    {
      "dayOfWeek": "string ('Monday', 'Tuesday', ...)",
      "startTime": "time (HH:mm)",
      "endTime": "time (HH:mm)"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4.4. VitalRecord

```json
{
  "id": "string (uuid)",
  "patientId": "string (uuid)",
  "type": "string ('ecg', 'heartRate', 'bloodPressure', 'temperature', 'oxygenSaturation')",
  "value": "any", // Could be a number, or a complex object for ECG data
  "unit": "string (optional, e.g., 'bpm', 'mmHg', '°C', '%')",
  "timestamp": "datetime",
  "recordedBy": "string (userId or 'device_id')"
}
```
**Example ECG Value:**
```json
{
  "leadData": [0.1, 0.12, 0.15, ...], // Array of numbers representing ECG points
  "samplingRateHz": 250
}
```

### 4.5. Message

```json
{
  "id": "string (uuid)",
  "chatId": "string (uuid)", // Identifier for the conversation thread
  "senderId": "string (userId)",
  "receiverId": "string (userId)",
  "content": "string",
  "timestamp": "datetime",
  "status": "string ('sent', 'delivered', 'read')"
}
```

### 4.6. Contact (for Messaging)

```json
{
  "id": "string (userId of the contact)",
  "name": "string",
  "role": "string ('doctor', 'patient')",
  "avatarUrl": "string",
  "lastMessage": "string (preview)",
  "lastMessageTime": "datetime",
  "unreadCount": "integer",
  "online": "boolean"
}
```

### 4.7. Notification

```json
{
  "id": "string (uuid)",
  "userId": "string (uuid)", // User to whom the notification belongs
  "type": "string ('new_message', 'appointment_reminder', 'vital_alert')",
  "title": "string",
  "description": "string",
  "read": "boolean",
  "link": "string (optional, URL to navigate to)",
  "timestamp": "datetime",
  "sender": { // Optional: information about who triggered the notification
    "id": "string",
    "name": "string",
    "avatar": "string (url)"
  }
}
```

## 5. Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

*   **`200 OK`**: Request successful.
*   **`201 Created`**: Resource successfully created.
*   **`204 No Content`**: Request successful, but no response body.
*   **`400 Bad Request`**: The request was malformed (e.g., invalid JSON, missing parameters). Response body will contain error details.
    ```json
    {
      "error": "Validation Error",
      "message": "Specific error message.",
      "details": [
        { "field": "fieldName", "message": "Error for this field" }
      ]
    }
    ```
*   **`401 Unauthorized`**: Authentication failed or token is missing/invalid.
*   **`403 Forbidden`**: Authenticated user does not have permission to access the resource.
*   **`404 Not Found`**: The requested resource does not exist.
*   **`429 Too Many Requests`**: Rate limit exceeded.
*   **`500 Internal Server Error`**: An unexpected error occurred on the server.

## 6. Rate Limiting

To ensure fair usage and stability, API requests are rate-limited. The current limits are (example):
*   100 requests per minute per IP address.
*   1000 requests per hour per authenticated user.

If you exceed the rate limit, you will receive a `429 Too Many Requests` HTTP status code. Check the `Retry-After` header for when you can retry.

## 7. Versioning

The API is versioned via the URL (e.g., `/v1/`). Breaking changes will result in a new version (e.g., `/v2/`). Non-breaking changes may be added to the current version. We recommend checking the API changelog regularly.

## 8. Changelog (Example Section)

*   **v1.0.0 (2025-05-20)**: Initial release.
    *   Added endpoints for Patients, Doctors, Vitals, Messaging.
*   **v1.0.1 (Upcoming)**:
    *   Added `status` field to Patient model.
    *   Enhanced search capabilities for `/patients`.

