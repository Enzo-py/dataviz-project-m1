function toast(type, message) {
    var toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.remove();
    }, 3000);
}

let UNIQUE_ID = 0;

function pop_up_confirm(message, callback) {
    var pop_up_wrapper = document.createElement('div');
    pop_up_wrapper.classList.add('pop-up-wrapper');
    var pop_up_background = document.createElement('div');
    pop_up_background.classList.add('pop-up-background');
    var pop_up = document.createElement('div');
    pop_up.classList.add('pop-up');

    pop_up_wrapper.setAttribute('id', 'pop-up-' + UNIQUE_ID);
    UNIQUE_ID++;

    var pop_up_message = document.createElement('div');
    pop_up_message.classList.add('pop-up-message');
    pop_up_message.innerHTML = message;

    var pop_up_buttons = document.createElement('div');
    pop_up_buttons.classList.add('pop-up-buttons');
    var yes_button = document.createElement('button');
    yes_button.classList.add('yes-button');
    yes_button.innerHTML = 'Yes';
    yes_button.onclick = function() {
        callback();
        pop_up_wrapper.remove();
    };

    var no_button = document.createElement('button');
    no_button.classList.add('no-button');
    no_button.innerHTML = 'No';
    no_button.onclick = function() {
        pop_up_wrapper.remove();
    };

    pop_up_buttons.appendChild(yes_button);
    pop_up_buttons.appendChild(no_button);

    pop_up.appendChild(pop_up_message);
    pop_up.appendChild(pop_up_buttons);

    pop_up_wrapper.appendChild(pop_up_background);
    pop_up_wrapper.appendChild(pop_up);

    document.body.appendChild(pop_up_wrapper);

    // pop_up_background.onclick = function() {
    //     pop_up_wrapper.remove();
    // };

    // set pop_up on the middle
    var pop_up_height = pop_up.clientHeight;
    var pop_up_width = pop_up.clientWidth;
    pop_up.style.top = 'calc(50% - ' + pop_up_height / 2 + 'px)';
    pop_up.style.left = 'calc(50% - ' + pop_up_width / 2 + 'px)';

    return pop_up_wrapper;
}

function pop_up_next(message, callback, no_background) {
    var pop_up_wrapper = document.createElement('div');
    pop_up_wrapper.classList.add('pop-up-wrapper');
    var pop_up_background = document.createElement('div');
    pop_up_background.classList.add('pop-up-background');
    var pop_up = document.createElement('div');
    pop_up.classList.add('pop-up');

    pop_up_wrapper.setAttribute('id', 'pop-up-' + UNIQUE_ID);
    UNIQUE_ID++;

    var pop_up_message = document.createElement('div');
    pop_up_message.classList.add('pop-up-message');
    pop_up_message.innerHTML = message;

    var pop_up_buttons = document.createElement('div');
    pop_up_buttons.classList.add('pop-up-buttons');
    var next_button = document.createElement('button');
    next_button.classList.add('next-button');
    next_button.innerHTML = 'Next';
    next_button.onclick = function() {
        pop_up_wrapper.remove();
        callback();
    };

    pop_up_buttons.appendChild(next_button);

    pop_up.appendChild(pop_up_message);
    pop_up.appendChild(pop_up_buttons);

    if (no_background === undefined)
        pop_up_wrapper.appendChild(pop_up_background);
    pop_up_wrapper.appendChild(pop_up);

    document.body.appendChild(pop_up_wrapper);

    // pop_up_background.onclick = function() {
    //     pop_up_wrapper.remove();
    // };

    // set pop_up on the middle
    var pop_up_height = pop_up.clientHeight;
    var pop_up_width = pop_up.clientWidth;
    pop_up.style.top = 'calc(50% - ' + pop_up_height / 2 + 'px)';
    pop_up.style.left = 'calc(50% - ' + pop_up_width / 2 + 'px)';

    return pop_up_wrapper;
}

function pop_up_showcase(message) {
    var pop_up_wrapper = document.createElement('div');
    pop_up_wrapper.classList.add('pop-up-wrapper');
    var showcase_background = document.createElement('div');
    showcase_background.classList.add('showcase-background');
    var pop_up = document.createElement('div');
    pop_up.classList.add('pop-up');

    pop_up_wrapper.setAttribute('id', 'pop-up-' + UNIQUE_ID);
    UNIQUE_ID++;

    var pop_up_message = document.createElement('div');
    pop_up_message.classList.add('pop-up-message');
    pop_up_message.innerHTML = message;

    pop_up.appendChild(pop_up_message);

    pop_up_wrapper.appendChild(pop_up);
    pop_up_wrapper.appendChild(showcase_background);

    document.body.appendChild(pop_up_wrapper);

    // set pop_up on the middle
    var pop_up_height = pop_up.clientHeight;
    var pop_up_width = pop_up.clientWidth;
    pop_up.style.top = 'calc(50% - ' + pop_up_height / 2 + 'px)';
    pop_up.style.left = 'calc(50% - ' + pop_up_width / 2 + 'px)';

    return pop_up_wrapper;
}

function highlight_tr(tr) {
    tr.transition()
        .duration(500)
        .style("transform", "scale(1.1)")
        .style("filter", "brightness(1.8)")
        .transition()
        .duration(500)
        .style("transform", "scale(1.02)")
        .style("filter", "brightness(1.2)")
        .on("end", function() {
            if (animation_running) {
                highlight_tr(tr)
            }
        })
}
