import type { Metadata } from "next";
import { AppointmentsManager } from "@/components/admin/AppointmentsManager";
import { PageTitle } from "@/components/admin/PageTitle";
import { Pagination } from "@/components/admin/Pagination";
import { SearchFilter } from "@/components/admin/SearchFilter";
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { getAppointments, getTreatmentOptions, type AppointmentFilters } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Appointments" };

const statusOptions = APPOINTMENT_STATUSES.map((value) => ({ value, label: APPOINTMENT_STATUS_LABELS[value] }));

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<AppointmentFilters> }) {
  const filters = await searchParams;
  const [result, treatments] = await Promise.all([getAppointments(filters), getTreatmentOptions()]);

  return (
    <>
      <PageTitle title="Appointments" description="Review requests, contact patients and update each appointment's status." />
      <SearchFilter
        placeholder="Search by patient name"
        withDate
        selects={[
          { name: "treatment", label: "Treatments", options: treatments },
          { name: "status", label: "Statuses", options: statusOptions },
        ]}
      />
      <AppointmentsManager appointments={result.items} />
      <Pagination {...result} basePath="/admin/appointments" params={filters} />
    </>
  );
}
