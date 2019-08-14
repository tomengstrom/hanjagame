import * as React from 'react';
import { Debug } from "../../Debug";

import { Character } from "./Character";

export class Scene extends React.Component<{},{}> {
    
    characters: any
    background: any

    constructor(props: any) {
        super(props);

        this.characters = [];
        this.background = null;

    }

    add_character(character: Character, position: any) {
        
    }

    render() {
        return ( <div>
        </div>
        )
    }

}