'use client'
import React, {useEffect, useRef} from "react";
import 'jsoneditor/dist/jsoneditor.css';
import SaveButton from "@/app/components/SaveButton";

export default function Home() {
    const json = {
        'array': [1, 2, 3],
        'boolean': true,
        'null': null,
        'number': 123,
        'object': {'a': 'b', 'c': 'd'},
        'string': 'Hello World',
        'color': '#82b92c'
    };

    const containerRef = useRef(null);
    let jsonEditor: any = null;

    useEffect(() => {
        // @ts-ignore
        import("jsoneditor").then((JSONEditor) => {
            const options = {
                modes: ['text', 'view'],
                mode: 'view',
            };
            if (!jsonEditor) {
                jsonEditor = new JSONEditor.default(containerRef.current, options);
                jsonEditor.set(json);

                return () => {
                    if (jsonEditor) {
                        jsonEditor.destroy();
                    }
                };
            }
        });
    }, []);

    // useEffect(() => {
    //     if (jsonEditor) {
    //         jsonEditor.update(json);
    //     }
    // }, [json, jsonEditor]);

    return (
        <div style={{margin: '-8px'}}>
            <div style={{height: '95vh'}} className="jsoneditor-react-container" ref={containerRef}/>
            <SaveButton jsonData={json} />
        </div>
    );
}