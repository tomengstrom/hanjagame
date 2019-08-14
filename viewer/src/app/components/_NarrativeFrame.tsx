import * as React from 'react';
import { Debug } from "../Debug";
import { Narrative } from './Narrative';

Debug.enable_scope('_NarrativeFrame');

// "data": {
//     "render": {
//         "background": "restaurant.exterior",
//         "characters": {
//             "main": {
//                 "base": "standing.outside"
//             }
//         }    
//     },


export abstract class _NarrativeFrame {

    components: Array<any>
    data: any
    nextFrame: string
    type: string
    narrative: Narrative
    controls: JSX.Element
    
    constructor(args: any) {
        this.data = args.data;
        this.nextFrame = args.nextFrame;
        this.type = args.type;
        this.narrative = args.narrative;

        this.components = this._create_components();
    }

    next() {
        let next_component = this._get_next_component();
        if ( next_component ) {

            if( this.data.render) {
                // Update image
                this.narrative.update_image(this.data.render);

                // "render": {
                //     "background": {
                //         "restaurant": {
                //             "base": "exterior"
                //         }
                //     },
                //     "characters": {
                //         "main": {
                //             "base": "standing"
                //         }
                //     }    
                // },

                // // FIXME make dynamic
                // if (this.data.render.background) {
                //     image_args.background = this.data.render.background;
                // }
                // if (this.data.render.characters) {
                //     image_args.characters = this.data.render.characters; 
                // }

                // this.narrative.update_image(image_args);
            }

            // Add the component to the narrative
            this.narrative.add_component(next_component);
        }
        else {
            // No more components in this frame
            // Tell parent narrative to get the next frame
            this.narrative.next_frame();
        }
    }

    // Figures out which component to show next
    protected _get_next_component(): any {
        return this.components.shift();
    }

    protected _create_components(): Array<any> {
        throw new Error("_create_components not implemented");
    }

}