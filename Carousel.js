/**
 * Create a carousel instance. A carousel is a data object that stores objects
 * and allows a user to move foward and backward. Objects can be added and 
 * removed from a carousel. 
 * 
 * @returns Carousel
 */
Carousel = function() 
{
    this.objectList = {};
    this.keyList = [];
    this.current = null;
};

/**
 * Add an object to the carousel
 * 
 * @param {string} key
 * @param {object} value
 * @returns {object} deleted
 */
Carousel.prototype.add = function(key, value) 
{
    this.objectList[key] = value;
    this.keyList.push(key);
    return this.objectList[key];
};

/**
 * Delete an object from the carousel
 * 
 * @param {string} key
 * @returns {object} deleted
 */
Carousel.prototype.delete = function(key) 
{
    var removed = null;
    for(var i = 0; i < this.keyList.length; i++)
    {
        if(this.keyList[i] === key) 
        {
            removed = this.objectList[key];
            this.keyList.splice(i, 1);
            delete this.objectList[key];
        }
    }
    
    return removed;
};

/**
 * Moves the carousel forward
 * 
 * @returns {object} head
 */
Carousel.prototype.forward = function() 
{
    var obj = null;
    var key = null;
    
    if(this.keyList.length > 0) 
    {
        key = this.keyList.shift();
        this.keyList.push(key);
        obj = this.objectList[this.keyList[0]];
    }
    
    return obj;
};

/**
 * Moves the carousel backwards
 * 
 * @returns {object} head
 */
Carousel.prototype.backward = function() 
{
    var obj = null;
    var key = null;
    
    if(this.keyList.length > 0) 
    {
        key = this.keyList.pop();
        this.keyList.unshift(key);
        obj = this.objectList[this.keyList[0]];
    }
    
    return null;
};