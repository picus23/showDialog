
let old_wx0183 = null;
function showDialog({title, message, buttons, data}){
    const main_buttons = buttons;
    const main_message = message;
    function serializator(_frm) {
        let array = Array.from(new FormData(_frm));
        let result = {};
        for (let i in array) {


            let name = array[i][0];
            let value = array[i][1];

            if (name.indexOf('[') != -1) {
                let exp = name.split('[');
                let new_name = exp[0];
                let id = exp[1].replace(']', '');

                if (new_name in result) {
                    result[new_name] = Object.assign(result[new_name], { [id]: value });
                } else {
                    result = Object.assign(result, { [new_name]: { [id]: value } });
                }
            } else {
                result = Object.assign(result, { [name]: value });
            }
        }

        return result;
    }


    
    
    const _modelDi = document.createElement("div")
    let mouseOnCloseWrapper = false
    const remove_black = () => { if (old_wx0183) old_wx0183.parentNode.removeChild(old_wx0183); old_wx0183 = null}
    remove_black()
    old_wx0183 = _modelDi
    const on_mousedown = function (e) {
        if (e.target == this && window.outerWidth - e.clientX > 50)
        mouseOnCloseWrapper = true
	}
	const on_mouseup = function () {
        if (mouseOnCloseWrapper) {
            document.body.style.overflow = 'auto'
            remove_black()
		}
	}
    
    _modelDi.classList.add('black')
    _modelDi.onmousedown = on_mousedown
    _modelDi.onmouseup = on_mouseup


    const _form = document.createElement("form")
    _form.classList = ['_form']
    const fieldset = document.createElement("fieldset")
    _form.appendChild(fieldset)


    const _formRight = document.createElement("form")
    _formRight.style.display = 'none'
    _formRight.classList = ['_formRight']


    const close_panel = getButtons({ '✖': (e) => { mouseOnCloseWrapper = true; on_mouseup() } }, title)
	close_panel.classList = ['close_panel']
    

    function insertData(html, data){
		if (data){
			for (let i of Object.keys(data)){
                // html = replaceAll2(html, '$'+i, data[i]);
                html = html.split('$' + i).join(data[i])
			}
		}
		return html;
	}


    function messageToFieldset(to, message, data){
        // const to = to_right ? _formRight : fieldset;
        if (message instanceof Promise){
            to.innerHTML = 'Подождите...';
            message.then(itm => {
				if (typeof itm == 'function'){
					console.log(itm);
					itm = itm();
					if (itm==false)
						return false;
				}
				if (itm instanceof Response)
					return itm.text();
				return itm;
			}).then(itm => {
				if (itm)
                    to.innerHTML = insertData(itm, data)
			});


        } else if (message instanceof HTMLElement) {
            to.appendChild(message)
        } else {
            to.innerHTML = insertData(message, data);
        }
    }
    
    if (main_message)
        messageToFieldset(fieldset, main_message, data)

    const window = document.createElement("div")
    window.classList.add('window')
    window.appendChild(close_panel)

    
    const form_panel = document.createElement("div")
    form_panel.classList = ['form_panel']
    form_panel.appendChild(_form)
    form_panel.appendChild(_formRight)

    window.appendChild(form_panel)
    
    
    const bottomButtons = document.createElement("div")
    if (buttons)
        bottomButtons.appendChild(getButtons(main_buttons))

    window.appendChild(bottomButtons)
    _modelDi.appendChild(window)
    



    function getButtons(buttons, title) {
        let result = document.createElement("div")
        result.classList.add('buttons_panel')
        if (title){
            const titlex = document.createElement("div")
            titlex.innerText = title
            titlex.classList = ['dialogTitle']
            result.appendChild(titlex)
        }


        if (typeof buttons == 'object') {
            for (let title of Object.keys(buttons)) {
                let btn = document.createElement('button')
                btn.innerHTML = title
                // if (title)
                //     btn.onclick = buttons[title]
                // else 
                // {
                    btn.onclick = () => {
                        const f = buttons[title].bind({
                            right: ({message, buttons, width}) => {
                                const htmldata = document.createElement("div")
                                if (width){
                                    window.style.width = (650 + width)+'px'
                                    _formRight.style.width = width + 'px'
                                    htmldata.style.width = width - 30 + 'px'
                                } else 
                                    window.style.width = '850px'

                                _formRight.style.height = _form.offsetHeight + 'px'
                                _formRight.innerHTML = '';
                                _formRight.appendChild(htmldata)
                                messageToFieldset(htmldata, message, false)
                                
                                _form.style.background = "#fcfcfc";
                                _formRight.style.display = 'block'
                                // _formRight.innerHTML = mess
                                fieldset.disabled = true;

                                const closeRight = () => {
                                    window.style.width = '650px'
                                    _formRight.style.display = 'none'
                                    bottomButtons.innerHTML = '';
                                    _form.style.background = "#fff";
                                    bottomButtons.appendChild(getButtons(main_buttons))
                                    fieldset.disabled = false;
                                }
                                bottomButtons.innerHTML = '';

                                const apply = () => {
                                    const data2 = serializator(_formRight)
                                    
                                    data = Object.assign(data, data2)
                                    messageToFieldset(fieldset, main_message, data)
                                    return data2
                                }

                                if (buttons) {
                                    const btns2 = {}
                                    for (let i of Object.keys(buttons)){
                                        btns2[i] = () => {
                                            closeRight()
                                            buttons[i](apply())

                                        }
                                    }
                                    bottomButtons.appendChild(getButtons(btns2))
                                } else 
                                    bottomButtons.appendChild(getButtons({'Сохранить': () => {
                                        closeRight()
                                        apply()
                                    }}))
                            }
                        })
                        f(serializator(_form))
                    }
                // }
                result.appendChild(btn)
            }
        } else {

        }
        return result
    }
    


    document.body.appendChild(_modelDi)
}