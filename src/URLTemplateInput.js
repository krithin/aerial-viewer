import React from 'react';

const URLTemplateInput = (props) => {
  const urlTemplateInput = React.useRef();
  const zoomOffsetInput = React.useRef();
  return (
    <div id='url-template-container' className='sidebarStyle'>
      <div>
        <label>URL Template:
          <textarea ref={urlTemplateInput} id='url-template' rows="6" value={props.defaultURL} onChange={() => props.onChangeURL(urlTemplateInput.current.value)} />
        </label>
      </div>
      <div>
        <label>Zoom Offset:
          <input ref={zoomOffsetInput} type='number' id='zoom-offset' defaultValue={props.zoomOffset} onChange={() => props.onChangeZoomOffset(zoomOffsetInput.current.value)} />
        </label>
      </div>
    </div>
  )
};

export default URLTemplateInput;
