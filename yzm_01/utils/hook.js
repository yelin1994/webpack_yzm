/**
 * 1, 为什么不能在条件和循环中，函数组件外部 使用hook
 * 2, react hook 状态保存在哪里
 * 
 */



 //按位操作

 const NoFlag  = 0b00 //0
 const HasEffect = 0b001 // 1
 const layout = 0b010 //2 React.uselayoutEffect
 const passive = 0b100 // 4 React.useEffect

 let layoutTag = HasEffect|layout // 0b011

 if (layoutTag&layout !== NoFlag) { 
     console.log('uselayoutEffect')
 }
 let tag = HasEffect| passive

 if (tag&passive !== NoFlag) {
     console.log('use Effect');
 }

 // 循环链表

 
// 组件更新时候用到
 function dispatchAction(queue, action) {
     const update = {action ,next: null} // 创建一个update对象
     const pending = queue.pending;
     if (pending === null) {
         update.next = update // 自己和自己构成一个 环状链表
     } else  {
        update.next = pending.next;
        pending.next = update;
     }
     queue.pending = update;
 }

 let queue = {
    pending: null
}
dispatchAction(queue, 'action1');
dispatchAction(queue, 'action2');
const pendingQueue = queue.pending;
if (pendingQueue !== null) {
    let first = pendingQueue.first;
    let update = first;
    do {
        console.log(update);
        update = update.next
    } while(update!== first)
}

//


