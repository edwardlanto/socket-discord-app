const roomsObj = {
    rooms:["Anime", "Coding", "Going on dates", "Learning"],
    get sliceTitle(){
        return this.rooms.map(item => item.slice(0,3))
    }
};

module.exports = roomsObj;