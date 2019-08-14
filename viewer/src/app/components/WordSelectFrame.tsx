import * as React from 'react';
import { _NarrativeFrame } from './_NarrativeFrame';
import { Debug } from "../Debug";
import { Narrative } from './Narrative';

Debug.enable_scope('WordSelectFrame');

// {
//     "id": "018_explaining-select",
//     "type": "WordSelectFrame",
    
//     "data": {
//         "rounds": [
//             {
//                 "prompt": "Say 'I don't have money' or 'I forgot my wallet'.",
//                 "correct_responses": [
//                     "나는 돈이 없어요.", "나는 내 지갑을 잊어버렸어요."
//                 ],
//                 "incorrect_responses": [
//                     "시험이", "직장을", "지갑이", "있어요", "동이"
//                 ],
//                 "correct_actions": {
//                     "narrative": {
//                         "characters": {
//                             "waiter": {
//                                 "mood": -1
//                             }
//                         }
//                     }
//                 },
//                 "incorrect_actions": {
//                     "narrative": {
//                         "characters": {
//                             "waiter": {
//                                 "mood": -1
//                             }
//                         },
//                         "mainCharacter": {
//                             "energy": -1
//                         }
//                     }
//                 },
                
//                 "responseDialogue": [
//                     { "lines": ["네??"], "character": "waiter" }
//                 ]
//             },
//             {
//                 "prompt": "Say 'But I can go home and get money'.",
//                 "correct_responses": [
//                     "하지만, 나는 집에 가서 돈을 좀 얻을 수 있어요."
//                 ],
//                 "incorrect_responses": [
//                     "그럼", "왠야하면", "오서", "너는", "동을"
//                 ],
//                 "correct_actions": {
//                     "narrative": {
//                         "characters": {
//                             "waiter": {
//                                 "mood": -1
//                             }
//                         }
//                     }
//                 },
//                 "incorrect_actions": {
//                     "narrative": {
//                         "characters": {
//                             "waiter": {
//                                 "mood": -1
//                             }
//                         },
//                         "mainCharacter": {
//                             "energy": -1
//                         }
//                     }
//                 },
//                 "responseDialogue": [
//                     {
//                         "lines": ["아 알겠어요", "그럼, 그렇게 하세요."],
//                         "character": "waiter"
//                     }
//                 ]
//             }
            
//         ],
        
//         "failureStates": [
//             {
//                 "state": {
//                     "narrative": {
//                         "mainCharacter": {
//                             "energy": 0
//                         }
//                     }
//                 },
//                 "resultFrame": "019_energy-depleted"
//             }
//         ]
           
//     },
//     "nextFrame": "21_thank-you"
// },

export class WordSelectFrame extends _NarrativeFrame {

    _create_components() {
        var components = [];
        
        components.push('')

        return components;
    }

    next() {
        // Hide next button until selection is complete
        if (this.components.length) {
            this.narrative.hide_next();
        }
        super.next();
    }



}