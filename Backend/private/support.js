// expose useful functions to js scripts that may need them
module.exports = {
    getBasicDate: function(){
        var date_time = new Date();
        return date_time;
    },
    isEmptyObject: function(obj){           
        // CITATION: https://stackoverflow.com/questions/11480769/how-can-i-check-if-a-json-is-empty-in-nodejs
        // CODE Used to help differentiate between home page calls and homework assingment GET Forms request on /    
        return !Object.keys(obj).length;
    }
}