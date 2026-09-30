Build a simple mobile application named **InDer — Instant Reminder**.

Purpose:
Help students quickly record notes, tasks, and reminders in one application. The application allows users to create notes and set reminders so important activities are less likely to be forgotten.

The application should focus on simplicity and fast input. This is an individual university software engineering project, so keep the scope simple and avoid unnecessary advanced features.

Use this stack:

- Frontend: React Native + TypeScript + Expo
- Development platform: Windows
- Target device: iPhone
- Local database: SQLite
- Notifications: Expo Notifications
- Storage: Local device storage / SQLite
- No backend server
- No authentication
- No cloud synchronization
- No App Store publishing required

Code rules:

- Do not add comments unless truly necessary.
- Use PascalCase for all classes, types, interfaces, enums, React components, database models, and DTOs.
- Local variables and functions may use camelCase.
- Keep code lines below 150 characters where practical.
- Use a clean and simple folder structure.
- Keep the application suitable for a beginner university software engineering project.
- Do not add unnecessary libraries or features.
- All user-facing text must use Indonesian language.

Main entities:

1. Note

   - Id
   - Title
   - Content
   - CreatedAt
   - UpdatedAt
   - IsCompleted

2. Reminder

   - Id
   - NoteId
   - ReminderDateTime
   - IsActive
   - CreatedAt

Relationship:

- One Note can have zero or one Reminder.
- A Reminder belongs to one Note.
- Deleting a Note should also remove its associated Reminder.

Database rules:

- Store all notes and reminders locally using SQLite.
- Notes must remain available after the application is closed and reopened.
- Reminders must remain available after the application is closed.
- Do not use a remote database.
- Do not require an internet connection for basic note functionality.
- Use SQLite migrations or a simple database initialization system.
- Seed a small amount of example data only if necessary for development.

Core features:

1. Create Note

   - User can create a note quickly.
   - Required field: Title.
   - Optional field: Content.
   - Automatically save CreatedAt and UpdatedAt.
   - Newly created notes appear on the home screen.

2. Edit Note

   - User can edit the title and content.
   - UpdatedAt must be updated automatically.

3. Delete Note

   - User can delete a note.
   - Show a confirmation dialog before deletion.
   - Associated reminder must also be deleted.

4. Complete Note

   - User can mark a note as completed.
   - User can mark a completed note as incomplete.
   - Completed notes should have a different visual appearance.

5. Create Reminder

   - User can set a reminder for a note.
   - User selects date and time.
   - The application schedules a local notification.
   - Reminder must be stored in SQLite.

6. Edit Reminder

   - User can change the reminder date and time.
   - The previous notification must be cancelled.
   - A new notification must be scheduled.

7. Delete Reminder

   - User can remove a reminder from a note.
   - The scheduled notification must also be cancelled.

8. Reminder Notification

   - Show a local notification when the scheduled reminder time is reached.
   - Notification title should contain the note title.
   - Notification body should contain useful reminder information.

9. Search Notes

   - User can search notes by title or content.
   - Search should work against locally stored notes.

10. Filter Notes

   - User can filter notes by:
     - Semua
     - Belum selesai
     - Selesai
     - Memiliki reminder

11. Quick Note

   - The home screen should provide a prominent button to quickly create a note.
   - The process of creating a note should require as few steps as possible.

Pages / Screens:

1. Home

   - Show application name: InDer
   - Show today's reminders or upcoming reminders.
   - Show list of notes.
   - Show note title.
   - Show short content preview.
   - Show completion status.
   - Show reminder date/time if available.
   - Search button/input.
   - Filter options.
   - Floating or prominent `Tambah Catatan` button.
   - Do not automatically create or modify reminders from the home screen.

2. Create Note

   - Form containing:
     - Judul
     - Isi catatan
   - Button: `Simpan`
   - Button: `Batal`
   - Validation message if title is empty.

3. Note Detail

   - Show complete note information.
   - Show title.
   - Show content.
   - Show created date.
   - Show updated date.
   - Show completion status.
   - Show reminder information if available.
   - Button: `Edit`
   - Button: `Tandai Selesai`
   - Button: `Atur Pengingat`
   - Button: `Hapus`

4. Edit Note

   - Allow editing title and content.
   - Button: `Simpan Perubahan`
   - Button: `Batal`

5. Reminder Form

   - Show selected note.
   - Date picker.
   - Time picker.
   - Button: `Simpan Pengingat`
   - Button: `Batal`
   - Validate that the selected reminder time is in the future.

6. Search

   - Search input.
   - Display matching notes.
   - Show empty state if no notes match the search.

7. Settings

   - Show basic application information.
   - Show notification permission status.
   - Provide option to request notification permission again.
   - No account settings or cloud synchronization.

UI requirements:

- Use Indonesian language for all labels, buttons, validation messages, empty states, and notifications.
- Create a clean and simple mobile UI.
- Design should prioritize fast note creation.
- Use cards for notes.
- Use badges for reminder and completion status.
- Use green styling for completed tasks.
- Use a noticeable but simple style for active reminders.
- Use red styling only for destructive actions such as delete.
- Use confirmation dialogs before deleting notes.
- Use empty states when there are no notes or reminders.
- Make the interface responsive for common iPhone screen sizes.
- Use accessible touch targets.
- Do not add charts.
- Do not add unnecessary animations.
- Do not add social features.
- Do not add login or registration.

Reminder behavior:

- When a user creates a reminder, schedule a local notification using Expo Notifications.
- When a reminder is edited, cancel the previous scheduled notification before scheduling the new one.
- When a reminder is deleted, cancel its scheduled notification.
- When a note is deleted, cancel any notification associated with its reminder.
- The application must not send data to an external server.
- The application must not automatically synchronize with any external service.

Data model:

```text
Note
  Id
  Title
  Content
  CreatedAt
  UpdatedAt
  IsCompleted

Reminder
  Id
  NoteId
  ReminderDateTime
  IsActive
  CreatedAt
```

Relationship:

```text
Note 1 ───────── 0..1 Reminder
```

Architecture:

Use a simple layered architecture:

```text
UI Layer
    ↓
Service / Business Logic Layer
    ↓
Repository / Data Access Layer
    ↓
SQLite
```

Suggested structure:

```text
inder/
  src/
    components/
      NoteCard.tsx
      StatusBadge.tsx
      EmptyState.tsx
      SearchBar.tsx

    screens/
      HomeScreen.tsx
      CreateNoteScreen.tsx
      NoteDetailScreen.tsx
      EditNoteScreen.tsx
      ReminderScreen.tsx
      SettingsScreen.tsx

    services/
      NoteService.ts
      ReminderService.ts
      NotificationService.ts

    database/
      Database.ts
      NoteRepository.ts
      ReminderRepository.ts

    models/
      Note.ts
      Reminder.ts

    navigation/
      AppNavigator.tsx

    utils/
      DateUtils.ts
      ValidationUtils.ts

    constants/
      AppConstants.ts

    App.tsx

  assets/

  package.json
  tsconfig.json
  app.json
  README.md
```

Model rules:

- Define TypeScript models only once.
- `Note` and `Reminder` must be imported wherever they are required.
- Do not duplicate the same model definitions across multiple files.
- Database-specific logic must remain inside the database/repository layer.
- UI components must not directly execute SQL queries.
- Screens should call services rather than directly accessing SQLite.
- Keep business logic outside React components where practical.

Database requirements:

Create a SQLite database named:

```text
inder.db
```

Create the following tables:

```text
Notes
- Id
- Title
- Content
- CreatedAt
- UpdatedAt
- IsCompleted

Reminders
- Id
- NoteId
- ReminderDateTime
- IsActive
- CreatedAt
```

Database constraints:

- `Notes.Id` is the primary key.
- `Reminders.Id` is the primary key.
- `Reminders.NoteId` references `Notes.Id`.
- A note can have a maximum of one active reminder.
- Deleting a note must remove its reminder.
- Dates should be stored in a consistent format.
- Database operations should use parameterized queries.

Required application behavior:

Create Note:

```text
User opens Home
→ Presses "Tambah Catatan"
→ Enters title and content
→ Presses "Simpan"
→ Note is stored in SQLite
→ Home displays the new note
```

Create Reminder:

```text
User opens Note Detail
→ Presses "Atur Pengingat"
→ Selects date and time
→ Presses "Simpan Pengingat"
→ Reminder is stored in SQLite
→ Local notification is scheduled
→ Note displays the reminder
```

Complete Note:

```text
User opens a note
→ Presses "Tandai Selesai"
→ IsCompleted becomes true
→ UI displays the note as completed
```

Delete Note:

```text
User presses "Hapus"
→ Confirmation dialog appears
→ User confirms
→ Note is deleted
→ Associated reminder is deleted
→ Scheduled notification is cancelled
```

Search behavior:

```text
User enters search text
→ Search title and content
→ Display matching notes
→ If no result exists, show an empty state
```

Error handling:

Show Indonesian error messages for:

- Judul catatan kosong.
- Catatan gagal disimpan.
- Catatan gagal diperbarui.
- Catatan gagal dihapus.
- Pengingat gagal disimpan.
- Waktu pengingat sudah lewat.
- Notifikasi belum mendapatkan izin.
- Database gagal dibuka.
- Database operation gagal.
- Catatan tidak ditemukan.

Example messages:

```text
"Judul catatan wajib diisi."

"Catatan berhasil disimpan."

"Catatan berhasil diperbarui."

"Catatan berhasil dihapus."

"Pengingat berhasil dibuat."

"Waktu pengingat harus lebih dari waktu sekarang."

"Izin notifikasi diperlukan agar pengingat dapat bekerja."

"Belum ada catatan."

"Belum ada pengingat."

"Tidak ada catatan yang ditemukan."
```

Navigation:

Use a simple navigation structure:

```text
Home
 ├── Create Note
 ├── Note Detail
 │     ├── Edit Note
 │     └── Reminder
 ├── Search
 └── Settings
```

Project scope:

The first version must focus only on:

- Local notes.
- Local reminders.
- Local notifications.
- Search.
- Filtering.
- Completing notes.
- Editing notes.
- Deleting notes.
- Simple settings.

Do NOT implement:

- User authentication.
- Registration.
- Backend server.
- Cloud database.
- Cloud synchronization.
- Google Calendar integration.
- Apple Calendar integration.
- Account synchronization.
- Collaboration between users.
- Sharing notes.
- AI features.
- Voice notes.
- Image recognition.
- Chat functionality.
- Social features.
- Analytics dashboard.
- Complex animations.
- App Store publishing.
- Push notifications from a remote server.

Success criteria:

The application is considered successful when:

1. User can create a note successfully.
2. User can edit a note successfully.
3. User can delete a note after confirmation.
4. User can mark a note as completed.
5. User can create a reminder for a note.
6. User can edit an existing reminder.
7. User can delete a reminder.
8. A local notification appears at the scheduled reminder time.
9. Notes remain available after closing and reopening the application.
10. Reminders remain stored after closing and reopening the application.
11. Search can find notes by title or content.
12. Filters correctly display notes based on their status.
13. The application handles empty states and basic errors.
14. The application works correctly on an iPhone through Expo.
15. The application does not require an internet connection for basic note functionality.

Development requirements:

- Use Expo for development and testing.
- The project must run on Windows.
- The application must be testable on an iPhone using Expo Go during development.
- Use TypeScript throughout the project.
- Use SQLite for persistent local data.
- Use Expo Notifications for local reminders.
- Keep dependencies minimal.
- Provide npm scripts for development, building, and testing.

Required scripts should include:

```text
npm install
npm start
npm run android
npm run ios
npm run web
```

README requirements:

Create a `README.md` containing:

1. Project description.
2. Features.
3. Technology stack.
4. Project structure.
5. Requirements.
6. Installation steps.
7. How to run the application on Windows.
8. How to connect the application to an iPhone using Expo Go.
9. How SQLite is used.
10. How local notifications work.
11. Application scope.
12. Features intentionally not implemented.
13. Success criteria.

Installation should be simple:

```text
npm install
npx expo start
```

Then the developer can scan the Expo QR code using Expo Go on the iPhone.

Final requirements:

- Build the complete InDer application.
- Implement all core features described above.
- Keep the code simple and suitable for a university RPL project.
- Do not over-engineer the application.
- Do not add a backend.
- Do not add authentication.
- Do not add cloud services.
- Do not add features outside the defined scope.
- Ensure TypeScript compiles successfully.
- Ensure the Expo application starts successfully.
- Ensure SQLite operations work correctly.
- Ensure local notification scheduling works correctly.
- Ensure CRUD operations for notes and reminders work correctly.
- Ensure the final project structure is clean and understandable for a beginner developer.
