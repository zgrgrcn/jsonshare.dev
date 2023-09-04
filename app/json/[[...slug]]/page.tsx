'use client'
import UpdateButton from "@/app/components/UpdateButton";
import { useState, useRef, useEffect } from "react";
import 'jsoneditor/dist/jsoneditor.css';

export default function Page({ params }: { params: { slug: string } }) {
  const [newJson, setNewJson] = useState<any>({});

  const containerRef1 = useRef(null), containerRef2 = useRef(null);
  let jsonEditor1: any = null, jsonEditor2: any = null;

  useEffect(() => {
    fetch(`/api/save-data/${params.slug[0]}`, {
      method: 'GET',
    }).then((response) => {
      if (response.ok) {
        response.json().then((responseBody) => {
          setNewJson(responseBody.jsonData)
          initJsonEditor(responseBody.jsonData);
        });
      } else {
        console.error('response', response)
        console.error('Failed to get data from the database');
      }
    }).catch((error) => {
      console.error('An error occurred:', error);
    });
  }, []);

  const onChangeText = (jsonString: string) => {
    const newJson = JSON.parse(jsonString);
    setNewJson(newJson);
    if (jsonEditor2) jsonEditor2.update(newJson);
  };

  return (
    <div>
      <div style={{ height: '95vh' }} className="grid grid-cols-2 gap-4">
        <div className="jsoneditor" ref={containerRef1} />
        <div className="jsoneditor" ref={containerRef2} />
      </div>

      <UpdateButton jsonData={{...newJson, id: params.slug[0]}} />
    </div>
  );

  function initJsonEditor(newJson: any) {
    // @ts-ignore
    import("jsoneditor").then((JSONEditor) => {
      if (!jsonEditor1) {
        jsonEditor1 = new JSONEditor.default(containerRef1.current, {
          // modes: ['text', 'view', 'code'],
          mode: 'code',
          onChangeText: onChangeText,
        });
        jsonEditor1.set(newJson);
      }
      if (!jsonEditor2) {
        jsonEditor2 = new JSONEditor.default(containerRef2.current, {
          // modes: ['text', 'view'],
          mode: 'view',
        });
        jsonEditor2.set(newJson);
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
  }
}