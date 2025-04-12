import { Person } from "@prisma/client";

export type newLeadContact = Omit<Person, "leadId" | "cv" | "phone">;
