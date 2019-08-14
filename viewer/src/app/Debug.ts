// Basic togglable console debugger
export class Debug {

    private static instance: Debug
    private __is_scope_enabled: any;
    private __is_disabled: boolean;

    private constructor() {
        this.__is_scope_enabled = {};
        this.__is_disabled = false;
    }

    private static get_instance(): Debug {
        if (!Debug.instance) {
            Debug.instance = new Debug();
        }
        return Debug.instance;
    }

    private is_disabled() {
        return this.__is_disabled;
    }

    static disable() {
        Debug.get_instance().__is_disabled = true;
    }

    static enable_scope(scope: string) {
        Debug.get_instance().__is_scope_enabled[scope] = true;
        return;
    }

    static is_scope_enabled(scope: string) {
        if( Debug.get_instance().is_disabled() ) return false;
        return Debug.get_instance().__is_scope_enabled[scope];
    }

    private __log( message: string, object?: any ) {
        if( this.__is_disabled) return;
        console.log(message);
        if ( object ) {
            console.log(object);
        }
        return;
    }

    static log( scope: string, message: string, object?: any ) {        
        if ( !Debug.get_instance().__is_scope_enabled[scope] ) return;
        return Debug.get_instance().__log( scope + ':: ' + message, object);
    }

}