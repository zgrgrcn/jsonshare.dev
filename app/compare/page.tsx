import { Metadata } from 'next';
import { CompareView } from '@/app/components/compare/CompareView';

export const metadata: Metadata = {
  title: 'JSON Compare & Diff Online — JSON Share',
  description:
    'Compare two JSON documents online with recursive alphabetical key sorting, side-by-side visual diff, and missing field detection.',
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <CompareView initialLeftId={resolvedParams?.left} />;
}
