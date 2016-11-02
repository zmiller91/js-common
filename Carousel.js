/**
 * Create a carousel instance. A carousel is a data object that stores objects
 * and allows a user to move foward and backward. Objects can be added and 
 * removed from a carousel. 
 * 
 * @returns Carousel
 */
Carousel = function() 
{
    this._objectMap = {};
    this._keyList = [];
    this._currentKey = null;
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
    if(!(key in this._objectMap))
    {
        this._objectMap[key] = value;
        this._keyList.push(key);
        if(this._keyList.length === 1)
        {
            this._currentKey = key;
        }
    }
    
    return this._objectMap[key];
};

/**
 * Delete the current object from the carousel
 * 
 * @returns {object}
 */
Carousel.prototype.delete = function()
{
    var key = this._currentKey;
    return this.deleteKey(key);
}

/**
 * Delete an object with the specified key from the carousel
 * 
 * @param {string} key
 * @returns {object} deleted
 */
Carousel.prototype.deleteKey = function(key) 
{
    var removed = null;
    for(var i = 0; i < this._keyList.length; i++)
    {
        if(this._keyList[i] === key) 
        {
            removed = this._objectMap[key];
            this._keyList.splice(i, 1);
            delete this._objectMap[key];
            if(key === this._currentKey)
            {
                this._currentKey = this._keyList.length > 0 ?
                    this._keyList[0] :
                    null;
            }
        }
    }
    
    return removed;
};

/**
 * Moves the carousel forward
 * 
 * @returns {object} head
 */
Carousel.prototype.next = function() 
{
    var obj = null;
    var key = null;
    if(this._keyList.length > 0) 
    {
        key = this._keyList.shift();
        this._keyList.push(key);
        obj = this._objectMap[this._keyList[0]];
        this._currentKey = this._keyList[0];
    }
    
    return obj;
};

/**
 * Moves the carousel backwards
 * 
 * @returns {object} head
 */
Carousel.prototype.previous = function() 
{
    var obj = null;
    var key = null;
    if(this._keyList.length > 0) 
    {
        key = this._keyList.pop();
        this._keyList.unshift(key);
        obj = this._objectMap[this._keyList[0]];
        this._currentKey = this._keyList[0];
    }
    
    return obj;
};

/**
 * Returns the head of the carousel.
 * 
 * @returns {object}
 */
Carousel.prototype.current = function()
{
    return this._objectMap[this._currentKey];
};

/**
 * Returns the key of the current head.
 * 
 * @returns {string}
 */
Carousel.prototype.currentKey = function()
{
    return this._currentKey;
};

/**
 * Peeks ahead to the next key. If there is no next key, then the current key
 * is returned
 * 
 * @returns {string}
 */
Carousel.prototype.peek = function(key)
{
    return this._keyList.length > 1 ? this._keyList[1] : this._currentKey;
};

/**
 * Returns the key of the previous head
 * 
 * @returns {string}
 */
Carousel.prototype.last = function(key)
{
    return this._keyList.length > 0 ? 
        this._keyList[this._keyList.length - 1] : this._currentKey;
};