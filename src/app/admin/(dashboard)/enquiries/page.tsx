import type { Metadata } from "next";
import { EnquiriesManager } from "@/components/admin/EnquiriesManager";
import { PageTitle } from "@/components/admin/PageTitle";
import { Pagination } from "@/components/admin/Pagination";
import { SearchFilter } from "@/components/admin/SearchFilter";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS } from "@/lib/constants";
import { getEnquiries, type EnquiryFilters } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Enquiries" };

const statusOptions = ENQUIRY_STATUSES.map((value) => ({ value, label: ENQUIRY_STATUS_LABELS[value] }));

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<EnquiryFilters> }) {
  const filters = await searchParams;
  const result = await getEnquiries(filters);

  return (
    <>
      <PageTitle title="Enquiries" description="Messages sent through the contact form." />
      <SearchFilter placeholder="Search by name or email" selects={[{ name: "status", label: "Statuses", options: statusOptions }]} />
      <EnquiriesManager enquiries={result.items} />
      <Pagination {...result} basePath="/admin/enquiries" params={filters} />
    </>
  );
}
