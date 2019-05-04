import React from 'react';
import ReactDOM from 'react-dom';
import { Parent } from './Parent';
import './component/style.less';

const root = document.createElement('div');
root.setAttribute('class', 'root');
root.setAttribute('style', 'width:1024px;height:700px;position:absolute;transform-origin:left top;transform:scale(1,1);min-width:1024px;min-height:700px;margin:auto;left:0px;right:0px;overflow:hidden')
document.body.appendChild(root);
ReactDOM.render(
    <Parent />,
    root
);
