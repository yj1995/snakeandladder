import React from 'react'

function Piece({ id, x, y, color, scale }) {
  return (
    <div id={id} style={{ position: 'absolute', transform: `scale(${scale})`, left: x, top: y, background: color, width: 50, height: 50, border: '1px solid', textAlign: 'center', zIndex: 100, borderRadius: '50%', lineHeight: '54px', color: 'white', fontSize: 18 }}>
      {id}
    </div>
  )
}

export { Piece };
