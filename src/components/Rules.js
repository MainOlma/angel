import React, {useEffect, useState} from 'react';
import {getPageContent, savePageContent} from "./DbActions";
import CKEditor from 'ckeditor4-react';
import Markdown from "react-markdown";
import Button from "@material-ui/core/Button";

export default function Rules(props) {
    const [state, setState] = useState('');

    const callback = param => setState(param)

    useEffect(() => {
        getPageContent('rules', callback)
    }, []);

    const save = () => savePageContent('rules', state);

    return (
        <div>
            <Markdown escapeHtml={false}
                      source={state}/>
            {props.admin &&
            <div>
                <CKEditor
                    data={state}
                    onChange={e => {
                        setState(e.editor.getData());
                    }}
                />
                <Button className={'update'} onClick={save}>Сохранить</Button>
            </div>
            }
        </div>)
}