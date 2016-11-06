/**
 * Create a carousel instance. A carousel is a data object that stores objects
 * and allows a user to move foward and backward. The implementation of a 
 * Carousel is a circular queue of keys and a corresponding hashmap of
 * values. The head of the queue is a key that points to the current object
 * in the hashmap. The use of a circular queue and a hashmap allows for 
 * quick existence checks and updates.
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
 * Add an object to the carousel. If a key already exists in the carousel,
 * then the key will be overwritten with the new value.
 * 
 * @param {string} key
 * @param {object} value
 * @returns {object} deleted
 */
Carousel.prototype.add = function(key, value) 
{
    var exists = key in this._objectMap;
    this._objectMap[key] = value;
    if(!exists)
    {
        this._keyList.push(key);
        if(this._keyList.length === 1)
        {
            this._currentKey = key;
        }
    }
    
    return this._objectMap[key];
};

/**
 * Resets the Carousel to it's empty state. 
 * 
 * @returns {undefined}
 */
Carousel.prototype.reset = function()
{
    this._objectMap = {};
    this._keyList = [];
    this._currentKey = null;
}

/**
 * Delete the current object from the carousel
 * 
 * @returns {object}
 */
Carousel.prototype.deleteCurrent = function()
{
    var key = this._currentKey;
    return this.deleteKey(key);
};

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
 * Move the head of the carousel to the object with the specified key
 * 
 * @param {string} key
 * @returns {object}
 */
Carousel.prototype.seekTo = function(key)
{
    // If the key's index is in the first half of the carousel, then the 
    // quickest way to seek to the key is to move right
    var idx = this._keyList.indexOf(key);
    var moveRight = idx < (this._keyList.length / 2);
    while(idx !== -1 && this._currentKey !== key)
    {
        moveRight ? this.next() : this.previous();
    }
    
    return this.current();
};

/**
 * Checks if the provided key exists in the carousel
 * 
 * @param {string} key
 * @returns {boolean}
 */
Carousel.prototype.contains = function(key)
{
    return key in this._objectMap;
};

/**
 * Returns the keys of the next or previous objects, as specified by amount. 
 * If amount is negave the "previous" elements will be returned, otherwise
 * the "next" elements will be returned.
 * 
 * @param {int} amount
 * @returns {array}
 */
Carousel.prototype.preview = function(amount)
{
    if(Math.abs(amount) < this._keyList.length)
    {
        return amount >= 0 ? 
            this._keyList.slice(0, amount) : 
            this._keyList.slice(this._keyList.length + amount, this._keyList.length);
    }
    
    return this._keyList;
}

/**
 * Returns the object specified by the key. If the key does not exist, then
 * null is returned.
 * 
 * @param {string} key
 * @returns {object}
 */
Carousel.prototype.get = function(key)
{
    if(!this.contains(key))
    {
        return null;
    }
    
    return this._objectMap[key];
}