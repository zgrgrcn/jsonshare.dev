/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, {useEffect, useRef, useState} from "react";
import 'jsoneditor/dist/jsoneditor.css';
import SaveButton from "@/app/components/SaveButton";

export default function Home() {
    const [json, setJson]  = useState<any>({
        'array': [1, 2, 3],
        'boolean': true,
        'null': null,
        'number': 123,
        'object': {'a': 'b', 'c': 'd'},
        'string': 'Hello World',
        'color': '#82b92c'
    });
    const [parseError, setParseError] = useState<string | null>(null);

    const containerRef1 = useRef(null), containerRef2 = useRef(null);
    let jsonEditor1: any = null, jsonEditor2: any = null;

    useEffect(() => {
        // @ts-ignore
        import("jsoneditor").then((JSONEditor) => {

            if (!jsonEditor1) {
                jsonEditor1 = new JSONEditor.default(containerRef1.current, {
                    // modes: ['text', 'view', 'code'],
                    mode: 'code',
                    onChangeText: onChangeText,
                });
                jsonEditor1.set(json);
            }
            if (!jsonEditor2) {
                jsonEditor2 = new JSONEditor.default(containerRef2.current, {
                    // modes: ['text', 'view'],
                    mode: 'view',
                });
                jsonEditor2.set(json);
            }

            return () => {
                if (jsonEditor1) {
                    jsonEditor1.destroy();
                }
                if (jsonEditor2) {
                    jsonEditor2.destroy();
                }
            };
        });
    }, []);

    const onChangeText = (jsonString: string) => {
        // Gecersiz JSON yazarken istisna firlatip onizlemeyi dondurmemesi icin yakaliyoruz.
        try {
            const newJson = JSON.parse(jsonString);
            setParseError(null);
            setJson(newJson);
            if (jsonEditor2) jsonEditor2.update(newJson);
        } catch (error) {
            setParseError(error instanceof Error ? error.message : 'Invalid JSON');
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 py-3 md:grid-cols-2">
                <div className="jsoneditor h-full min-h-0" ref={containerRef1}/>
                <div className="jsoneditor h-full min-h-0" ref={containerRef2}/>
            </div>

            <div className="sticky bottom-0 z-30 shrink-0 border-t border-gray-200 bg-white/90 py-3 backdrop-blur dark:border-gray-700 dark:bg-dark/90">
                {parseError && (
                    <p className="mb-2 truncate text-sm text-amber-600 dark:text-amber-400" title={parseError}>
                        Invalid JSON — preview paused. {parseError}
                    </p>
                )}
                <SaveButton jsonData={json} disabled={!!parseError} />
            </div>
        </div>
    );
}
