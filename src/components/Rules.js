import React, { useEffect, useState } from 'react';
import { getPageContent, savePageContent } from './DbActions';
import CKEditor from 'ckeditor4-react';
import Button from '@material-ui/core/Button';
import Header from './Header';

export default function Rules(props) {
    const [state, setState] = useState('');

    const callback = param => setState(param);

    useEffect(() => {
        getPageContent('rules', callback);
    }, []);

    const save = () => savePageContent('rules', state);

    return (
        <div>
            <Header />
            <div className='page-content rules'>
                <h1>Правила и безопасность</h1>
                <div
                    className='rules-text'
                    dangerouslySetInnerHTML={{ __html: state }}
                />

                {props.admin &&
                    <div className='rules-edit'>
                        <CKEditor
                            data={state}
                            onChange={e => setState(e.editor.getData())}
                        />
                        <Button className='update' onClick={save}>
                            Сохранить
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
}