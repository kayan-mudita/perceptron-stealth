import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, getFeatureBySlug } from "@/data/features";
import FeaturePageTemplate from "@/components/features/FeaturePageTemplate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return { title: "Feature" };

  const title = `${feature.title} — Official AI`;
  return {
    title,
    description: feature.description,
    alternates: { canonical: `/features/${feature.slug}` },
    openGraph: {
      title,
      description: feature.description,
      url: `/features/${feature.slug}`,
      type: "article",
    },
  };
}

export default async function FeatureSubpage({ params }: PageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();
  return <FeaturePageTemplate slug={slug} />;
}
