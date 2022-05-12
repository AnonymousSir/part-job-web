import throttle from "./throttle";
import debounce from "./debounce";

const directives = [
  throttle,
  debounce
]

function useMyDirective(app) {
  directives.forEach(func => {
    func(app)
  })
}

export default useMyDirective