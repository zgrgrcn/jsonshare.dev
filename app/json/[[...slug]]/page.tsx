/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import UpdateButton from "@/app/components/UpdateButton";
import CopyLink from "@/app/components/CopyLink";
import { use, useState, useRef, useEffect } from "react";
import 'jsoneditor/dist/jsoneditor.css';

type Status = 'loading' | 'ready' | 'notfound' | 'error';

export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const jsonId = slug?.[0] ?? '';
  const [newJson, setNewJson] = useState<any>({});
  const [status, setStatus] = useState<Status>('loading');
  const [parseError, setParseError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');

  const containerRef1 = useRef<HTMLDivElement | null>(null);
  const containerRef2 = useRef<HTMLDivElement | null>(null);
  // Editor ornekleri ref'te tutuluyor: yerel degiskenler her render'da sifirlaniyordu.
  const editor1 = useRef<any>(null);
  const editor2 = useRef<any>(null);
  const loaded = useRef<any>(null);

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
          loaded.current = responseBody.jsonData;
          setNewJson(responseBody.jsonData);
          setStatus('ready');
        });
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        setStatus('error');
      });
  }, []);

  // Editorler ancak kapsayicilar DOM'a girdikten sonra kurulabilir.
  useEffect(() => {
    if (status !== 'ready') return;

    let disposed = false;

    // @ts-ignore
    import("jsoneditor").then((JSONEditor) => {
      // Efekt temizlendiyse ya da kapsayicilar DOM'dan ciktiysa hic dokunma:
      // jsoneditor kurulurken kapsayicinin genisligini olcuyor, null olursa patliyor.
      if (disposed) return;
      const c1 = containerRef1.current;
      const c2 = containerRef2.current;
      if (!c1 || !c2 || !c1.isConnected || !c2.isConnected) return;

      try {
        if (!editor1.current) {
          editor1.current = new JSONEditor.default(c1, {
            mode: 'code',
            onChangeText: onChangeText,
          });
          editor1.current.set(loaded.current);
        }
        if (!editor2.current) {
          editor2.current = new JSONEditor.default(c2, { mode: 'view' });
          editor2.current.set(loaded.current);
        }
      } catch (error) {
        console.error('jsoneditor init failed', error);
      }
    }).catch((error) => {
      console.error('jsoneditor import failed', error);
    });

    return () => {
      disposed = true;
      for (const ref of [editor1, editor2]) {
        try {
          ref.current?.destroy();
        } catch {
          // Kapsayici React tarafindan zaten kaldirilmis olabilir.
        }
        ref.current = null;
      }
    };
  }, [status]);

  const onChangeText = (jsonString: string) => {
    // Gecersiz JSON yazarken istisna firlatip onizlemeyi dondurmemesi icin yakaliyoruz.
    try {
      const parsed = JSON.parse(jsonString);
      setParseError(null);
      setNewJson(parsed);
      try {
        editor2.current?.update(parsed);
      } catch {
        // onizleme editoru kapatilmis olabilir
      }
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  if (status === 'notfound' || status === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {status === 'notfound' ? 'This JSON was not found' : 'Something went wrong'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {status === 'notfound'
            ? 'The link may be wrong, or the document was removed.'
            : 'Please try again in a moment.'}
        </p>
        <a href="/" className="rounded bg-primary-600 px-5 py-2 font-medium text-white hover:bg-primary-700">
          Create a new one
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 py-3 md:grid-cols-2">
        <div className="jsoneditor h-full min-h-0" ref={containerRef1} />
        <div className="jsoneditor h-full min-h-0" ref={containerRef2} />
      </div>

      <div className="sticky bottom-0 z-30 shrink-0 border-t border-gray-200 bg-white/90 py-3 backdrop-blur dark:border-gray-700 dark:bg-dark/90">
        {parseError && (
          <p className="mb-2 truncate text-sm text-amber-600 dark:text-amber-400" title={parseError}>
            Invalid JSON — preview paused. {parseError}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {shareUrl && <CopyLink url={shareUrl} />}
          <UpdateButton id={jsonId} jsonData={newJson} disabled={!!parseError} />
        </div>
      </div>
    </div>
  );
}
