class UniqueId {
    constructor() {
        this.uCount = 0;
    }

    generateID() {
        this.uCount++;
        if(this.uCount>100000) {
            this.uCount = 1;
        }
        return Date.now()+""+this.uCount;
    }
}

module.exports = new UniqueId();