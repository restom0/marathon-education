let count = 0; 
function moveLeft(){
    if(count>5){
        count = 0;
    }
    const width =300;
    const slider=document.getElementById("slider");
    slider.style.marginLeft ='-'+(count+1)*width+'px';
    count++;
}
function moveRight(){
    const width =300;
    const slider=document.getElementsByClassName("slider")[0];
    count--;
    if(count<=0){
        count = 5+count;
    }
    slider.style.marginLeft ='+'+(count)*width+'px';
    
}