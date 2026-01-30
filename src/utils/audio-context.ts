let audioContextInstance:AudioContext | null = null;

export const getAudioContext = () => {
    if(!audioContextInstance)    audioContextInstance = new AudioContext();
    return audioContextInstance;
}

export const resumeAudioContext: () => Promise<void> = () => {
    return getAudioContext().resume();
}

export const closeAudioContext: () => void = () => {
    if(audioContextInstance){
        audioContextInstance.close();
        audioContextInstance = null;
    }
}

export class AudioContextUtil {
    currentTime(){} // FIX

    private static instance: AudioContext | null = null;

    static getState():AudioContextState{
        return this.instance?.state  || 'suspended'
    }

    static getContext():AudioContext{
        if(!this.instance){
            try{
                this.instance = new AudioContext();
            } catch(error){
                console.error("Failed to create Context", error)
            }
        }
        return this.instance!;
    }

    static async ensureRunning(): Promise<void>{
        const audioContextInstance = this.getContext();
        if(audioContextInstance.state === 'suspended'){
            await audioContextInstance.resume();
        }
    }

    static logState():void{
        console.log('AudioContext state:', this.getState());
        if (this.instance) {
            console.log('Current time:', this.instance.currentTime);
            console.log('Sample rate:', this.instance.sampleRate);
        }
    }

}

export const audioContextUtil = AudioContextUtil;
