class logging{
    private namespace: string;

    private getTime(): string {
        return new Date().toISOString();
    }
    info (message: string, object?: any){
        console.log(`[${this.getTime()}] [INFO] [${this.namespace}] ${message}`, object || '');
    }
    warn (message: string, object?: any){
        console.warn(`[${this.getTime()}] [WARN] [${this.namespace}] ${message}`, object || '');
    }
    error (message: string, object?: any){
        console.error(`[${this.getTime()}] [ERROR] [${this.namespace}] ${message}`, object || '');
    }
    debug (message: string, object?: any){
        console.log(`[${this.getTime()}] [DEBUG] [${this.namespace}] ${message}`, object || '');
    }

    constructor(namespace: string){
        this.namespace = namespace;
    }
}

export default logging;