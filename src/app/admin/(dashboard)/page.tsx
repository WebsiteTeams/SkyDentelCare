import { CalendarCheck, CalendarClock, CalendarX, ClipboardList, Mail } from "lucide-react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageTitle } from "@/components/admin/PageTitle";
import { StatsCard } from "@/components/admin/StatsCard";
import { AppointmentStatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/data/admin";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";
import type { AppointmentDTO } from "@/types";

const columns: Column<AppointmentDTO>[] = [
  { header: "Patient", cell: (a) => <span className="font-semibold text-navy">{a.patientName}</span> },
  { header: "Treatment", cell: (a) => a.treatmentName },
  { header: "Preferred", cell: (a) => <span className="whitespace-nowrap">{formatDate(a.preferredDate)}, {formatTime(a.preferredTime)}</span>, className: "hidden md:table-cell" },
  { header: "Status", cell: (a) => <AppointmentStatusBadge status={a.status} /> },
  { header: "Last activity", cell: (a) => <span className="whitespace-nowrap">{formatDateTime(a.updatedAt)}</span>, className: "hidden md:table-cell" },
];

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <PageTitle title="Dashboard" description="An overview of appointment requests and enquiries." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard label="Total requests" value={stats.total} icon={ClipboardList} />
        <StatsCard label="Pending" value={stats.pending} icon={CalendarClock} />
        <StatsCard label="Confirmed" value={stats.confirmed} icon={CalendarCheck} />
        <StatsCard label="Cancelled" value={stats.cancelled} icon={CalendarX} />
        <StatsCard label="Total enquiries" value={stats.enquiries} icon={Mail} />
      </div>
      <div className="mt-10 mb-5 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-navy">Recent appointment activity</h2>
        <Button asChild variant="outline" size="sm"><Link href="/admin/appointments">View all</Link></Button>
      </div>
      <DataTable columns={columns} rows={stats.recent} getKey={(a) => a._id} emptyTitle="No activity yet." emptyDescription="Appointment requests from the website will appear here." />
    </>
  );
}
