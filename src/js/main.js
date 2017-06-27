// principal elt
let mka = document.getElementById("mka");
if (!mka) throw new Error('mka id not found');

let config = {
    'focus': 'mka'
}
config.actions = [];

import * as rightClick from './rightClick';
rightClick.active(mka, config);

import * as select from './select';
select.active(mka, config);

document.onkeydown = (e) => {
    console.log(config);
    config.actions[config.focus + '-arrow'](e);
}

document.getElementById("ok").onclick = (e)=> {
    config.focus = "rc";
}
