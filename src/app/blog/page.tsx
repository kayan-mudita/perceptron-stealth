import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI video generation, content strategy, and how professionals are using AI to build their online presence without filming.",
};

export default function BlogPage() {
  return <BlogClient />;
}
