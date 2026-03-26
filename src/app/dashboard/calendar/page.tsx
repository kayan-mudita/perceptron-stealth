import type { Metadata } from "next";
import CalendarClient from "./CalendarClient";

export const metadata: Metadata = {
  title: "Calendar | Official AI",
};

export default function CalendarPage() {
  return <CalendarClient />;
}
