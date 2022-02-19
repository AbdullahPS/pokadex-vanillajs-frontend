class Pokemon {

    constructor(id, catched = false) {
        this.id = id;
        this.catched = catched;
    }

    toggleCatched() {
        this.catched = !this.catched;
    }


}