import * as React from 'react';
import { _NarrativeFrame } from './_NarrativeFrame';
import { DialogueLine } from './DialogueLine';
import { Debug } from "../Debug";
import { Narrative } from './Narrative';

Debug.enable_scope('DialogueFrame');

export class DialogueFrame extends _NarrativeFrame {

    lines: []

    __convert_to_variable(word: string) {
        // Remove trailing punctuation (could be last word in a sentence)
        word = word.replace(/[\.\,\:\;\-\!\?]+$/g, "");
        // Remove the dollar sign
        word = word.replace( Narrative.VARIABLE_PREFIX, "" );

        var keys = word.split('.');
        var value = this.narrative.state.dynamicState;
        Debug.log('DialogueFrame', '__convert_to_variable', {
            word: word,
            keys: keys,
            value: value
        });
        for ( let key of keys ) {
            if ( key == "narrative" ) continue;
            Debug.log('DialogueFrame', '__convert_to_variable', {
                word: word,
                key: key,
                value: value
            });
            value = value[key];
        }
        Debug.log('DialogueFrame', '__convert_to_variable result is ' + value );
        return value;
    }

    _create_components(): Array<any> {
        let lines = [];
        if ( this.data.dialogue && this.data.dialogue.length ) {
            for ( let dialogue of this.data.dialogue ) {
                let name = dialogue.character;
                name = this.narrative.get_character_name(name);
                let index = 0;
                for ( let line of dialogue.lines ) {
                    let words = line.split(' ');
                    var self = this;
                    let variable_mapped_words = words.map( function(word: string) {
                        Debug.log('DialogueFrame', 'mapping word', {
                            word: word,
                            prefix: Narrative.VARIABLE_PREFIX
                        });
                        // Map word to variable if there's a variable prefix
                        if ( word.startsWith( Narrative.VARIABLE_PREFIX ) ) {
                            return self.__convert_to_variable(word);
                        }                        
                        return word;
                    } );
                    let variable_mapped_line = variable_mapped_words.join(' ');    
                    if(index > 0) name = '';                
                    lines.push( <DialogueLine key={this.narrative.get_ckey()} line={variable_mapped_line} name={name} />);
                    index++;
                }
            }
        }
        return lines;
    }

    



}