import * as React from 'react';

import { _NarrativeFrame } from './_NarrativeFrame';

import Select from 'react-select';

import { Debug } from "../Debug";


Debug.enable_scope('DialogueSelectFrame');

// {
//     "id": "003_select-response",
//     "type": "DialogueSelectFrame",
//     "render": "inherit",
//     "data": {
//         "prompt": "Respond politely",
//         "options": [
//             { "label": "eyy wassup", "nextFrame": "004_rude-response" },
//             { "label": "Thank you", "nextFrame": "004_polite-response" }
//         ]
//     }
// },


// {
//     "id": "006_selecting-dish",
//     "type": "DialogueSelectFrame",
//     "data": {
//         "render": {
//             "background": "restaurant.menu",
//             "characters": null
//         },
//         "prompt": "Select a menu item",
//         "options": [
//             { 
//                 "label": "Bibimbap", 
//                 "actions": {
//                     "narrative": {
//                         "selected_menu": "bibimbap"
//                     }
//                 },
//                 "nextFrame": "007_selected"
//             },
//             { 
//                 "label": "Kimchijjigae", 
//                 "actions": {
//                     "narrative": {
//                         "selected_menu": "kimchijjigae"
//                     }
//                 },
//                 "nextFrame": "007_selected"
//             }
//         ]
//     }
// },



interface DialogueSelectComponentProps {
    prompt: string
    options: Array<any>
    frame: DialogueSelectFrame
}
interface DialogueSelectComponentState {
    selected_option: any
    is_disabled: boolean
}
class DialogueSelectComponent extends React.Component<DialogueSelectComponentProps, DialogueSelectComponentState> {
    
    options: Array<any>

    constructor(props: DialogueSelectComponentProps) {
        super(props);

        this.options = this.props.options.map( function(item) {
            return {
                value: item.label,
                label: item.label,
                data: item
            }
        })

        this.state = {
            selected_option: null,
            is_disabled: false
        }

    }

    handle_change(selected_option: any) {
        this.setState({ selected_option: selected_option, is_disabled: true });
        this.props.frame.selected_dialogue_option( selected_option.data );
    }

    render() {
        return (
            <div className="dialogue-select">
                <p className='dialogue-select-prompt'>{this.props.prompt}</p>
                <Select
                    className='dialogue-select-options'
                    classNamePrefix='dialogue-select'
                    key={this.props.frame.narrative.get_ckey()}
                    value={this.state.selected_option}
                    onChange={this.handle_change.bind(this)}
                    options={this.options}
                    isDisabled={this.state.is_disabled}
                    menuIsOpen={true}
                />
            </div>
        )
    }

}

export class DialogueSelectFrame extends _NarrativeFrame {

    _create_components(): Array<any> {
        var components = [];
        components.push(
            <DialogueSelectComponent
                key={this.narrative.get_ckey()}
                prompt={this.data.prompt}
                options={this.data.options}
                frame={this}
                />
        );
        return components;
    }

    selected_dialogue_option(selected_option: any) {
        this.narrative.set_next_frame_id(selected_option.nextFrame);
        if (selected_option.actions) {
            // FIXME are actions always in the narrative scope?
            this.narrative.apply_action( selected_option.actions.narrative );
        }
        this.narrative.show_next();
    }

    next() {
        // Hide next button until selection is complete
        if (this.components.length) {
            this.narrative.hide_next();
        }
        super.next();
    }



}