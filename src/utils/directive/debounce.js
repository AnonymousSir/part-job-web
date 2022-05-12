function useDebounce(app) {
    // 自定义指令-防抖
    app.directive('mydebounce', {
      beforeUpdate(el, binding) {
        // 事件类型, 回调函数, 节流时间, 冒泡: false 捕获: true
        // func没参数可以简写方法名，有参数就写成数组 -> [fn, 'arg1', 'arg2' ...]
        let [ type = 'click', func, time = 300, immediate = true ] = binding.value;
  
        let fn = func
        let args = []
        // 判断func是否是数组，数组代表有参数，就提取参数和方法
        if (func instanceof Array) {
          fn = func[0]
          args = func.slice(1, func.length)
        }
  
        let timer = null
        // 因为要移除，所以将方法和事件类型挂到el对象上
        el.$type = type;
        el.$handle = () => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            fn(...args)
          }, time)
        }
        el.addEventListener(el.$type, el.$handle, immediate);
      },
      unmounted(el) {
        el.removeEventListener(el.$type, el.$handle);
      }
    })
  }
  
  export default useDebounce