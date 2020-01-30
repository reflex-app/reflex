function click(event) {
    const elems = document.getElementsByTagName(event.tagName);
    const match = elems[event.index];

    console.log(event.tagName, elems, match);
    console.log('click event');

    if (match) {
        if (document.createEvent) {
            window.setTimeout(function () {
                const evObj = document.createEvent("MouseEvents");
                evObj.initEvent("click", true, true);
                match.dispatchEvent(evObj);
            }, 0);
        } else {
            window.setTimeout(function () {
                if (document.createEventObject) {
                    const evObj = document.createEventObject();
                    evObj.cancelBubble = true;
                    match.fireEvent("on" + "click", evObj);
                }
            }, 0);
        }
    } else {
        throw new Error('No elements found based on event')
    }
}

module.exports = click