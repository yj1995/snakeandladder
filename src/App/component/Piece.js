import React from 'react'

function Piece({id,x,y,color,scale}) {
  return (
    <div id ={id} style={{position:'absolute',transform:`scale(${scale})`,left:x,top:y,background:color,width:30,height:30,border:'1px solid',textAlign:'center',zIndex:100}}>
    <div style={{lineHeight:'30px',height:'100%',width:'100%',color:'white'}}>{id}</div>
    </div>
  )
}

export {Piece};
