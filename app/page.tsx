'use client'
import React, {useEffect, useRef, useState} from "react";
// @ts-ignore
import JSONEditor from "jsoneditor";
import 'jsoneditor/dist/jsoneditor.css';

export default function Home() {
    const [json, setJSON] = useState({
            "id": "2489651045",
            "type": "CreateEvent",
            "actor": {
                "id": 665991,
                "login": "petroav",
                "gravatar_id": "",
                "url": "https://api.github.com/users/petroav",
                "avatar_url": "https://avatars.githubusercontent.com/u/665991?"
            },
            "repo": {"id": 28688495, "name": "petroav/6.828", "url": "https://api.github.com/repos/petroav/6.828"},
            "payload": {
                "ref": "master",
                "ref_type": "branch",
                "master_branch": "master",
                "description": "Solution to homework and assignments from MIT's 6.828 (Operating Systems Engineering). Done in my spare time.",
                "pusher_type": "user"
            },
            "public": true,
            "created_at": "2015-01-01T15:00:00Z"
        }
    );

    const containerRef = useRef(null);
    let jsonEditor: JSONEditor | null = null;

    const onChangeJSON = (updatedJSON: any) => {
        setJSON(updatedJSON);
    };

    useEffect(() => {
        const options = {
            modes: ['text', 'view'],
            mode: 'view',
            onChangeJSON: onChangeJSON,
            filter: false,
        };

        jsonEditor = new JSONEditor(containerRef.current, options);
        jsonEditor.set(json);

        return () => {
            if (jsonEditor) {
                jsonEditor.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (jsonEditor) {
            jsonEditor.update(json);
        }
    }, [json, jsonEditor]);

    return (
        <div className="jsoneditor-react-container" ref={containerRef}/>
    );
}
