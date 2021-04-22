

let workInprogress = null;

// 正常 需要从根节点
function render(fiber) {
    workInprogress = fiber;
    workloop()
}

function workloop() {
    
}