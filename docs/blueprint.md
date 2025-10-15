# **App Name**: CTPacker Tracker

## Core Features:

- Real-time Assignment Tracking: Track assignment of packers/pickers to CTPACKER slots in real-time using Firestore.
- KPI Dashboard: Display key performance indicators: total slots, assigned slots, vacant slots.
- Assignment Table with Status: Display all 12 CTPACKER slots with status (Vacant, Assigned, PSI Recount).
- Inline Editing: Allow inline editing of supervisor and packer/picker names directly in the table.
- Quick Assign Modal: Provide a modal for quickly assigning vacant slots to supervisors and packers/pickers.
- Supervisor Management: Allow adding new supervisor names to a master list.
- Unified Search and Filter: Implement a search bar to filter the table by CTPACKER ID, Supervisor, Packer Name, or Status.

## Style Guidelines:

- Primary color: Strong blue (#29ABE2) representing reliability and efficiency.
- Background color: Very light blue (#E5F6FD) to create a calm, clean working environment.
- Accent color: Green (#90EE90) to indicate assigned and available states.
- Body and headline font: 'Inter' sans-serif, for a modern, objective, neutral look, suitable for a data-heavy interface.
- Use simple, clear icons to represent actions (edit, save, delete) and status (vacant, assigned, recount).
- Divide the screen into three sections: Header/Controls, KPIs, and the Assignment Table, ensuring clear visual hierarchy.
- Use subtle transitions and animations when updating slot assignments or displaying KPIs.