import * as React from 'react';
import axios from 'axios';
import * as _ from "lodash";

import { Debug } from "../Debug";
import { DialogueLine } from "./DialogueLine";

import { _NarrativeFrame } from "./_NarrativeFrame";
import { IntermissionFrame } from "./IntermissionFrame";
import { DialogueFrame } from "./DialogueFrame";
import { DialogueSelectFrame } from "./DialogueSelectFrame";
import { WordSelectFrame } from "./WordSelectFrame";
import { Analyzer } from './Analyzer';

const STORAGE_HOST = '//localhost:3000';

interface NarrativeProps {
    components?: String
    count?: Number
}
interface NarrativeState {
    components: any
    count: Number
    next_hidden: boolean
    dynamicState: any
}

export class Narrative extends React.Component<NarrativeProps, NarrativeState> {

    static VARIABLE_PREFIX = '$'

    __characters: Array<any>

    __frames: Array<any>
    __failure_states: Array<any>
    __mainCharacter: any

    __current_frame: any

    __c_key: number

    __next_frame_id: string

    __image_filenames: any

    constructor(props: NarrativeProps) {
        super(props);

        Debug.enable_scope('Narrative');
        this.state = {
            components: new Array(),
            count: 0,
            next_hidden: false,
            dynamicState: {}
        };
    
        this.__c_key = 0;
        
        axios.get( STORAGE_HOST + '/viewer/get_sample_data')
            .then( (response: any) => {
                this.__init(response.data);
            });


        
    }

    __show_frame(frame: any) {
        Debug.log("Narrative", "__show_frame", frame);

        // Create object containing the logic for
        // each frame type
        var frame_object;
        let frame_props = {...frame, ...{ narrative: this } };
        switch( frame.type ) {
            case "IntermissionFrame":
                // This is basically a dialogueFrame with no character
                frame_object = new IntermissionFrame(frame_props);
                break;

            case "DialogueFrame":
                frame_object = new DialogueFrame(frame_props);
                break;

            case "DialogueSelectFrame":
                frame_object = new DialogueSelectFrame(frame_props);
                break;

            // case "WordSelectFrame":
            //     frame_object = new WordSelectFrame(frame_props);
            //     break;

            default: 
                Debug.log('Narrative', '__show_frame() unknown frame type ' + frame.type );
            break;

        }
        Debug.log('Narrative', '__show_frame() frame object is', frame_object);
        
        // OK Frame object is constructed
        // call start to hand over control to the frame object
        if (frame_object) {
            this.__current_frame = frame_object;
            frame_object.next();
        }
        return;
    }

    get_ckey(): number {
        return this.__c_key++;
    }

    add_component(component: any) {
        this.setState( {
            components: this.state.components.concat( [component] )
        });
    }

    set_next_frame_id(id: string) {
        this.__next_frame_id = id;
    } 

    apply_action(action_obj: any): void {
        Debug.log('Narrative', 'apply_action() before', {
            state: this.state,
            action_obj: action_obj
        });
        _.merge( this.state.dynamicState, action_obj );
        Debug.log('Narrative', 'apply_action() after', {
            state: this.state,
            action_obj: action_obj
        });
    }

    next_frame() {
        Debug.log('Narrative', 'next_frame()', {
            current_frame: this.__current_frame
        } );

        let next_frame_id = this.__next_frame_id || this.__current_frame.nextFrame;

        for ( let frame of this.__frames ) {
            //Debug.log( 'Narrative', 'considering frame against id ' + next_frame_id, frame );
            if ( frame.id == next_frame_id ) {
                // Unset next frame id in case it was set
                this.__next_frame_id = null;
                // Show next frame
                return this.__show_frame(frame);
            }
        }
        Debug.log('Narrative', 'next frame not found with id ' + next_frame_id );
    }

    // This should update the scene and the feed
    update_narrative( feed_component: any, scene_args: any ) {
        if ( scene_args ) {
            
        }
    }


    // Progresses the narrative frame
    next() {
        this.__current_frame.next();         
    }

    hide_next() {
        this.setState({ next_hidden: true });
    }
    show_next() {
        this.setState({ next_hidden: false });
    }

    find_image_src(render_object: any) {

        for ( let entity_name in render_object ) {
            let val = render_object[entity_name];
            let variant_key = val.base;
            Debug.log('Narrative', 'getting image', {
                render_object: render_object,
                files: this.__image_filenames,
                entity_name: entity_name,
                variant_key: variant_key
            });
            return STORAGE_HOST + '/static/' + this.__image_filenames[entity_name][variant_key];
        }
        return false;
    }

    update_image(render_object: any) {
        // FIXME make dynamic
        let background_src,main_src,waiter_src;
        if (render_object.background && render_object.background.restaurant.base) {
            let src = this.find_image_src({
                "restaurant": render_object.background.restaurant
            });
            if(src) {
                background_src = src;
            }
        }
        if (render_object.characters) {
            if(render_object.characters.main && render_object.characters.main.base) {
                let src = this.find_image_src({
                    "main": render_object.characters.main
                });
                if(src) {
                    main_src = src;
                }
            }
            if(render_object.characters.waiter && render_object.characters.waiter.base) {
                let src = this.find_image_src({
                    "waiter": render_object.characters.waiter
                });
                if(src) {
                    waiter_src = src;
                }
            }            
        }
        if(background_src || main_src || waiter_src) {
            this.setState( { dynamicState: _.merge(this.state.dynamicState, {
                background: background_src ? background_src : this.state.dynamicState.background,
                main_character: main_src ? main_src : this.state.dynamicState.main_character,
                waiter: waiter_src ? waiter_src : this.state.dynamicState.waiter
            } ) })
        }
    }

    __init(data: any) {
        Debug.log('Narrative', '__init() got data', data);

        // Initialize characters
        for ( let character of data.characters ) {
            Debug.log('Narrative', '__init got character ' + character.name );
        }

        this.__image_filenames = data.images;
        this.__mainCharacter = data.mainCharacter;
        this.__characters = data.characters;
        this.__failure_states = data.failureStates;

        this.__frames = data.frames;
        Debug.log( 'Narrative', 'got frames', this.__frames );

        this.__show_frame( this.__frames[0] );

        return;
    }

    get_character_name(id: string) {
        if(id == "main") {
            return this.__mainCharacter.name;
        }
        for ( let char of this.__characters ) {
            if(char.id == id) return char.name;
        }
        Debug.log( 'Narrative', 'get_character_name: name not found with id ' + id );
        return id;
    }

    render() {

        // FIXME make characters dynamic 
        return (
            <div className="narrative">
                <div className="narrative_image">
                    <img className='narrative_image_character narrative_image_character--main' src={this.state.dynamicState.main_character} />
                    <img className='narrative_image_character narrative_image_character--npc' src={this.state.dynamicState.waiter} />
                    <img className='narrative_image_background' src={this.state.dynamicState.background} />
                </div>
                <div className="narrative_content">{this.state.components}</div>
                <div className="narrative_controls" data-hidden={this.state.next_hidden}><button onClick={this.next.bind(this)}>v</button></div>
            </div>
        );
    }
}