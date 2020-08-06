import React from 'react';

const URLTemplateInput = (props) => {
  const textArea = React.useRef();
  return (
    <div id='url-template-container' className='sidebarStyle'>
      <label>URL Template:
        <textarea ref={textArea} id='url-template' rows="1" defaultValue={props.value} onChange={() => props.onChange(textArea.current.value)} />
      </label>
    </div>
  )
};

export default URLTemplateInput;
