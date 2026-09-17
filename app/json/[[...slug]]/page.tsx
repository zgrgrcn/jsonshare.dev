'use client';
import React, { use, useState, useEffect } from 'react';
import UpdateButton from '@/app/components/UpdateButton';
import CopyLink from '@/app/components/CopyLink';
import NextLink from 'next/link';
import { ArrowLeftRight, AlertCircle, RefreshCw } from 'lucide-react';
import { UnifiedShareEditor } from '@/app/components/studio/UnifiedShareEditor';

type Status = 'loading' | 'ready' | 'notfound' | 'error';

export default function SharedJsonPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = use(params);
  const jsonId = slug?.[0] ?? '';
  const [jsonData, setJsonData] = useState<any>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!jsonId) {
      setStatus('notfound');
      return;
    }

    fetch(`/api/save-data/${jsonId}`, { method: 'GET' })
      .then((response) => {
        if (response.status === 404) {
          setStatus('notfound');
          return;
        }
        if (!response.ok) {
          setStatus('error');
          return;
        }
        return response.json().then((responseBody) => {
          setJsonData(responseBody.jsonData);
          setStatus('ready');
        });
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        setStatus('error');
      });
  }, [jsonId]);

  if (status === 'loading') {
    return (
      <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
        <p className="text-sm">Loading shared JSON...</p>
      </div>
    );
  }

  if (status === 'notfound' || status === 'error') {
    return (
      <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {status === 'notfound' ? 'This JSON was not found' : 'Something went wrong'}
        </h1>
        <p className="max-w-md text-xs text-gray-500 dark:text-gray-400">
          {status === 'notfound'
            ? 'The permalink may be incorrect, or this snippet was deleted.'
            : 'We could not load this document. Please try again in a moment.'}
        </p>
        <NextLink
          href="/"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          Create a new JSON
        </NextLink>
      </div>
    );
  }

  return (
    <UnifiedShareEditor
      initialData={jsonData}
      onChangeData={setJsonData}
      renderFooterActions={(currentData, parseError) => (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            {shareUrl && <CopyLink url={shareUrl} />}
            {jsonId && (
              <NextLink
                href={`/compare?left=${jsonId}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                title="Compare this JSON with another version"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Compare</span>
              </NextLink>
            )}
          </div>
          <UpdateButton id={jsonId} jsonData={currentData} disabled={!!parseError} />
        </div>
      )}
    />
  );
}
