const events = ["mousedown", "mouseup", "keydown", "keyup"]
const currentPosShow = document.getElementById("caretposition");

function onContentEditableChange() {
  let caretPos = 0, range;
  const sel= window.getSelection();
  if (sel.rangeCount) {
    range = sel.getRangeAt(0);
    if (range.commonAncestorContainer.parentNode == this) {
      caretPos = range.endOffset;
    }
  }
  console.log(caretPos);
  currentPosShow.textContent = caretPos;
}
const main = document.getElementById("main");
events.forEach(event => {
  main.addEventListener(event, onContentEditableChange);
})