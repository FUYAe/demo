// 窗口拖动
let onMove = false
let offsetX;
let offsetY;
const container = document.querySelector(".container")
let oddStyle = window.getComputedStyle(container)
const dragElement = document.querySelector(".drag-bar")
dragElement.addEventListener("mousedown", onMouseDown)


function onMouseDown(e) {
    onMove = true
    offsetX = e.offsetX
    offsetY = e.offsetY
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
}

function onMouseMove(e) {
    if (onMove) {
        let boxWidth = parseFloat(oddStyle.width)
        let boxHeight = parseFloat(oddStyle.height)
        container.style.left = `${Math.min(window.innerWidth - boxWidth, Math.max(0, e.clientX - offsetX))}px`
        container.style.top = `${Math.min(window.innerHeight - boxHeight, Math.max(0, e.clientY - offsetY))}px`


    }
}

function onMouseUp() {
    onMove = false
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
}



// 通过四条边扩大缩小窗口

function onResize(e, edgeClass, moveAxis) {
    /**
     *
     *
     * @param {*} e
     * @param {*} edgeClass 监听的边
     * @param {*} moveAxis 影响的轴（width/height)
     */
    let oddStyle = window.getComputedStyle(container);
    let moveDirect = parseFloat(oddStyle[moveAxis]);
    let left = parseFloat(oddStyle.left);
    let top = parseFloat(oddStyle.top);
    let limitX = 0;
    let limitY = 0;
    let movement = moveAxis === "width" ? e.clientX - left : e.clientY - top;
    if (edgeClass === ".edge-right" || edgeClass === ".edge-bottom") {
        // 使用Math.max限定范围
        container.style[moveAxis] = `${Math.min(
            edgeClass === ".edge-right"
                ? window.innerWidth - left
                : window.innerHeight - top,
            Math.max(200, movement)
        )}px`;
    }
    if (edgeClass === ".edge-top" || edgeClass === ".edge-left") {
        let movement =
            moveAxis === "width"
                ? left - Math.max(limitX, e.clientX)
                : top - Math.max(limitY, e.clientY);
        container.style[moveAxis] = `${Math.max(
            200,
            moveDirect + movement
        )}px`;
        if (moveAxis === "width") {
            container.style.left = `${Math.max(limitX, e.clientX)}px`;
        } else if (moveAxis === "height") {
            container.style.top = `${Math.max(limitY, e.clientY)}px`;
        }
    }
}




//使出口可以改变大小
function resizeOnEdge(edgeClass, moveAxis) {
    // 中间函数传参数
    function fn(e) {
        onResize(e, edgeClass, moveAxis)
    }

    function clearListener() {
        document.removeEventListener("mousemove", fn)
        document.removeEventListener("mouseup", clearListener)
    }
    const target = document.querySelector(edgeClass)
    target.addEventListener("mousedown", () => {
        document.addEventListener("mousemove", fn)
        document.addEventListener("mouseup", clearListener)
    })
}

resizeOnEdge(".edge-right", "width")
resizeOnEdge(".edge-left", "width")
resizeOnEdge(".edge-top", "height")
resizeOnEdge(".edge-bottom", "height")






// 通过四个角改变窗口大小
function onResizeCorner(e, cornerClass) {
    let left = parseFloat(oddStyle.left)
    let top = parseFloat(oddStyle.top)
    let width = parseFloat(oddStyle.width)
    let height = parseFloat(oddStyle.height)
    let limitX = 0
    let limitY = 0
    let mX = e.clientX - left
    let mY = e.clientY - top
    let mXIn = left - Math.max(limitX, e.clientX)
    let mYIn = top - Math.max(limitY, e.clientY)
    if (cornerClass === ".corner-rt") {
        container.style.top = `${Math.max(limitY, e.clientY)}px`
        container.style.width = `${Math.max(200, mX)}px`
        container.style.height = `${Math.max(200, height + mYIn)}px`
        return
    }
    if (cornerClass === ".corner-lt") {

        container.style.top = `${Math.max(limitX, e.clientY)}px`
        container.style.left = `${Math.max(limitX, e.clientX)}px`
        container.style.width = `${Math.max(200, width + mXIn)}px`
        container.style.height = `${Math.max(200, height + mYIn)}px`

        return
    }
    if (cornerClass === ".corner-lb") {
        container.style.left = `${Math.max(limitX, e.clientX)}px`
        container.style.width = `${Math.max(200, width + mXIn)}px`
        container.style.height = `${Math.max(200, mY)}px`

        return
    }

    container.style.width = `${Math.min(window.innerWidth - left, Math.max(200, mX))}px`
    container.style.height = `${Math.min(window.innerHeight - top, Math.max(200, mY))}px`



}



function resizeOnCorner(cornerClass) {
    function fn(e) {
        onResizeCorner(e, cornerClass)
    }

    function clearListener() {
        document.removeEventListener("mousemove", fn)
        document.removeEventListener("mouseup", clearListener)
    }
    const target = document.querySelector(cornerClass)
    target.addEventListener("mousedown", () => {
        document.addEventListener("mousemove", fn)
        document.addEventListener("mouseup", clearListener)
    })
}
resizeOnCorner(".corner-rb")
resizeOnCorner(".corner-rt")
resizeOnCorner(".corner-lt")
resizeOnCorner(".corner-lb")