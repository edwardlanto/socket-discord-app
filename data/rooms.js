const roomsObj = {
    rooms: ["Anime", "Coding", "Eating", "Learning"],
    get sliceTitle(){
        return this.rooms.map(item => item.slice(0,3))
    }
};

module.exports = roomsObj;