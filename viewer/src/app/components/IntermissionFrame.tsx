import * as React from 'react';
import { _NarrativeFrame } from './_NarrativeFrame';
import { Debug } from "../Debug";

Debug.enable_scope('IntermissionFrame');

export class IntermissionFrame extends _NarrativeFrame {

    _create_components() {
        return new Array( <div key={this.narrative.get_ckey()} className="intermission-frame">{this.data.content}</div> )
    }

}