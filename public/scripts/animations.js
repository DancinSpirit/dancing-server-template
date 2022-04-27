let transitionSpeed = 1000;

const left = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${transitionSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            resolve();
        },transitionSpeed)
    })
}
const right = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${transitionSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                resolve();
            },transitionSpeed)
        },10);
    })
}
const up = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${transitionSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${state}-container`).css("display","flex");
            resolve();
        },transitionSpeed)
    })
}
const down = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${transitionSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },transitionSpeed)
        },10);
    })
}

const none = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#old-sub-${state}`).remove();
        resolve();
    })
}