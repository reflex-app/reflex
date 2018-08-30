function $eventHandler($el, bool, event, func) {
    if (bool === "on") {
        $($el).on(event, func);
    } else if ( bool === "off") {
        // Fn: off(events, selector, handler)
        $($el).off(event, func);
    }

    console.log($el, bool, event, func);
    
}

// Usage:
// $eventHandler(".element", "on", "click", doSomething);