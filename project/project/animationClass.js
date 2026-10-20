export class Animation {
    constructor (details={"coords": [0,0], "time": 4, "onEnd": function(){}}){
        this.coords = details["coords"]
        this.time = details["time"]
        this.onEnd = details["onEnd"]
    }
}

