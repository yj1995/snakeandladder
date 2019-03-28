import React from 'react'

function Square({x,y,id,color,fontColor}) {
  return (
    <div id ={id} className = 'Square' style={{position:'absolute',left:x,top:y,background:color,width:65,height:65,border:'1px solid',textAlign:'center'}}>
    <div style={{lineHeight:'65px',height:'100%',width:'100%',color:fontColor}}>{id}</div>
    </div>
  )
}

export {Square};

