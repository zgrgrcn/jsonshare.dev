'use client';
import React, { useState } from 'react';
import SaveButton from '@/app/components/SaveButton';
import { UnifiedShareEditor } from '@/app/components/studio/UnifiedShareEditor';

const INITIAL_JSON = {
  array: [1, 2, 3],
  boolean: true,
  null: null,
  number: 123,
  object: { a: 'b', c: 'd' },
  string: 'Hello World',
  color: '#82b92c',
};

export default function Home() {
  const [json, setJson] = useState<any>(INITIAL_JSON);

  return (
    <UnifiedShareEditor
      initialData={json}
      onChangeData={setJson}
      renderFooterActions={(currentData, parseError) => (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {parseError ? (
              <span className="font-medium text-amber-600 dark:text-amber-400">
                Invalid JSON — resolve syntax errors to save.
              </span>
            ) : (
              <span>Your JSON is valid and ready to share.</span>
            )}
          </div>
          <SaveButton jsonData={currentData} disabled={!!parseError} />
        </div>
      )}
    />
  );
}
