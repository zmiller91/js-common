/**
 * Construct a new PriorityQueue. It is left to the implementer to provide the 
 * insert and remove comporator. The implementer must also provide a 'largest' 
 * comporator that asserts that param1 is greater than param2. 
 * 
 * The user is left to implement the comporators because the comporations might
 * be nontrivial.  For example, an implementor may want to compare an object
 * that is nested 3 levels deep.
 * 
 * A priority queue is represented as an array of elements where the root
 * element is at idx=1 and th root's left most child is at idx*2 and it's
 * right most child is at idx*2 + 1. A child's parent is at idx/2. 
 * 
 * @returns {PriorityQueue}
 */
PriorityQueue = function(cmpInsert, cmpRemove, cmpLgr) {
    this.heap = [];
    this.heap[0] = -1;

    this.cmpInsert = cmpInsert;
    this.cmpRemove = cmpRemove;
    this.cmpLgr = cmpLgr;
}

PriorityQueue.prototype.empty = function() {
    return this.heap.length === 1;
}

/**
 * To insert a new element, append it to the end of the array and walk it up 
 * the array switching places with it's parent if it's value is greather 
 * than the value of it's parent.
 */
PriorityQueue.prototype.insert = function(element){
    
    this.heap.push(element);
    var idx = this.heap.length - 1;
    while(idx > 1 && this.cmpInsert(this.heap[idx], this.heap[Math.floor(idx/2)])){
        
        var parentIdx = Math.floor(idx/2);
        var parentElement = this.heap[parentIdx];
        this.heap[parentIdx] = this.heap[idx];
        this.heap[idx] = parentElement;
        idx = parentIdx;
    }
    
    return true;
}

/**
 * To remove the largest element, append the last element to the end of the array 
 * and walk it down the array switching places with it's largest child if 
 * it's value is less than the value of either child.
 */
PriorityQueue.prototype.remove = function(){
    
    var head = null;
    
    // Handle the trivial cases
    if(this.heap.length === 1) {
        return null;
    } else if(this.heap.length === 2){
        return this.heap.pop();
    }
    
    var head = this.heap[1];
    this.heap[1] = this.heap.pop();
    var idx = 1;
    
    while(this.cmpRemove(this.heap[idx], this.heap[idx*2], this.heap[idx*2+1])) {
        
        var lChild = idx*2;
        var rChild = idx*2+1;
        var childIdx = this.cmpLgr(this.heap[lChild], this.heap[rChild]) 
            ? lChild : rChild;
        
        // Swap
        var childElement = this.heap[childIdx];
        this.heap[childIdx] = this.heap[idx];
        this.heap[idx] = childElement;
        idx = childIdx;
    }
    
    return head;
}