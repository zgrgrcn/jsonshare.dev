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
        const newJson = JSON.parse(jsonString);
        setJson(newJson);
        if (jsonEditor2) jsonEditor2.update(newJson);
    };

    return (
        <div>
            <div style={{height: '85vh'}} className="grid grid-cols-2 gap-4">
                <div className="jsoneditor" ref={containerRef1}/>
                <div className="jsoneditor" ref={containerRef2}/>
            </div>
            
            <SaveButton jsonData={json} />
        </div>
    );
}