import regularPolygon from './shapeDom/regularPolygon.vue'
import rect from './shapeDom/rect'
import circle from './shapeDom/circle'
import gradient from './shapeDom/gradient'
export { initLoop, ShapeCreator, ColorDescriber } from './ShapeCreator'

regularPolygon.install = function(Vue) { Vue.component(regularPolygon.name, regularPolygon) }
rect.install = function(Vue) { Vue.component(rect.name, rect) }
circle.install = function(Vue) { Vue.component(circle.name, circle) }
gradient.install = function(Vue) { Vue.component(gradient.name, gradient) }

// Cus是指 cut-shape
export const CusRegularPolygon = regularPolygon
export const CusRect = rect
export const CusCircle = circle
export const CusGradient = gradient
