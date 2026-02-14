# Specification

## Summary
**Goal:** Expand each role dashboard with embedded live widgets and add driver/admin operational tools, including trip lifecycle controls and admin user management.

**Planned changes:**
- Parent dashboard: add embedded widgets for live vehicle location (with link to /tracking), recent alerts preview (link to /alerts), recent pickup/drop-off preview (link to /pickup-dropoff), and assigned route summary (with English empty-state when none).
- Student dashboard: add embedded widgets for live vehicle location (link to /tracking), an English ETA summary with graceful “ETA not available” fallback, and assigned route summary (with English empty-state when none).
- Driver dashboard: show assigned route summary (with English empty-state), add Start Trip / End Trip controls with clear enabled/disabled states based on whether an active trip exists, add GPS tracking enable/disable controls with permission handling and periodic vehicle location updates, and add a pickup checklist panel with link to /pickup-dropoff (plus an English message when no assigned vehicle).
- Backend: add driver-authorized methods to start/end trips for the caller’s assigned vehicle/route (admins retain full control), enforcing that drivers can only operate on their assignedVehicle and updating trip lastUpdated.
- Admin dashboard: add an “Active Trips” panel listing non-completed trips with link to /trips; add navigation to an admin user management screen.
- Admin user management screen: list user profiles with search/filter by name and/or Principal text; show role and assignment fields (assignedVehicle/assignedRoute) when present; provide navigation to existing /admin/roles and /admin/drivers flows for a selected user.
- Backend: add an admin-only query to list stored user profiles for the admin user management screen, returning unauthorized for non-admin callers.

**User-visible outcome:** Parents and students see live tracking/route info (and ETA for students) directly on their dashboards; drivers can start/end trips and toggle GPS tracking from their dashboard while managing pickup status; admins can monitor active trips and search/manage user profiles via a dedicated admin user management view.
