import * as React from 'react';

interface DialogueLineProps {
    line: string
    name: string
    key: Number
}
export const DialogueLine: React.FunctionComponent<DialogueLineProps> = (props) => {
    return (
        <div className="dialogue-line" data-new-line={props.name.length > 0}>
            <p className="dialogue-line_name">{props.name}</p>
            <p className="dialogue-line_content">{props.line}</p>
        </div>
    )
}
