# Firestore Security Specification

## 1. Data Invariants
- **Identity Integrity**: Users can only create and manage their own profile (`/users/{userId}`).
- **Role Lockdown**: The `role` field in `/users/{userId}` is immutable after creation to prevent privilege escalation.
- **Relational Ownership**:
  - Appointments must link back to valid `patientId` and `doctorId`.
  - Only doctors can create `medicalRecords`.
  - Patients can only view `medicalRecords` where `patientId` matches their anonymous UID.
- **State Integrity**: Appointments have a fixed lifecycle (pending -> confirmed -> completed). Once 'completed', few fields should change.

## 2. The Dirty Dozen (Test Payloads)

| Test ID | Collection | Action | Payload / Scenario | Expected |
|:---:|:---:|:---:|:---:|:---:|
| 1 | `users` | update | Change `role` from 'patient' to 'doctor' | DENIED |
| 2 | `users` | update | Modify another user's profile | DENIED |
| 3 | `doctors` | create | Patient creating a doctor profile for themselves | DENIED |
| 4 | `doctors` | update | Injecting a 2MB experience description string | DENIED |
| 5 | `appointments` | create | User setting `patientId` to someone else's UID | DENIED |
| 6 | `appointments` | update | Patient changing the `doctorId` of an existing appointment | DENIED |
| 7 | `appointments` | update | Doctor changing the `patientId` of an existing appointment | DENIED |
| 8 | `medicalRecords` | create | Patient creating their own medical record | DENIED |
| 9 | `medicalRecords` | update | User modifying a record they didn't create (unless admin) | DENIED |
| 10 | `medicalRecords` | list | User querying all records without filtering by `patientId` or `doctorId` | DENIED |
| 11 | `system` | write | Writing to a reserved system collection | DENIED |
| 12 | `any` | create | Document ID over 128 characters or containing poison characters | DENIED |

## 3. Test Runner (Mock)
A corresponding test file `firestore.rules.test.ts` will verify these denials.
