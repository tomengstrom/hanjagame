

export class Character {

    static DEFAULT_MOOD: ''

    current_mood: string
    mood_image_of: any

    constructor(args: any) {
        this.set_mood(Character.DEFAULT_MOOD);

        this.mood_image_of = args.mood_images;
    }


    set_mood(mood:string) {
        if(this.mood_image_of[mood]) {
            this.current_mood = this.mood_image_of[mood];
        }
        this.current_mood = Character.DEFAULT_MOOD;
    }

    
    

}