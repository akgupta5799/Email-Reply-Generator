    // console.log("Email Writer Extension - Content Script Loaded");

    // function createAIButton(){
    //     const button = document.createElement('div');
    //     button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    //     button.style.marginRight = '8px';
    //     button.innerHTML = 'AI Reply'; // user will see
    //     button.setAttribute('role', 'button'); 
    //     button.setAttribute('data-tooltip', 'Generate AI Reply');
    //     return button;
    // }

    // function getEmailContent(){
    //     const selectors = [
    //         '.h7',
    //         'a3s.aiL',
    //         '.gmail_quote',
    //         '[role="presentation"]'
            
    //     ];

    //     for(const selector of selectors){
    //         const content = document.querySelector(selector);
    //         if(content){
    //             return content.innerText.trim();
    //         }
    //         return '';
    //     }
    // }

    // function findComposeToolbar(){
    //     const selectors = [
    //         '.aDg',
    //         '.HE',
    //         '.aDh',
    //         '.btC',
    //         '[role="toolbar"]',
    //         '.gU.Up'
    //     ];

    //     for(const selector of selectors){
    //         const toolbar = document.querySelector(selector);
    //         if(toolbar){
    //             return toolbar;
    //         }
    //         return null;
    //     }
    // }

    // function injectButton(){
    //     const existingButton = document.querySelector('.ai-reply-button');
    //     if(existingButton) existingButton.remove();

    //     const toolbar = findComposeToolbar();
    //     if(!toolbar){
    //         console.log("toolbar not found"); 
    //         return;
    //     } 

    //     console.log("Toolbar found, creating AI button");
    //     const button = createAIButton();
    //     button.classList.add('ai-reply-button');

    //     button.addEventListener('click', async () =>{
    //         try {
    //             button.innerHTML = 'Generating...';
    //             button.disabled = true;

    //             const emailContent = getEmailContent();
    //             const response = await fetch('http://localhost:8080/api/email/generate',{
    //                 method : 'POST',
    //                 headers : {
    //                     'Content-Type' : 'application/json',
    //                 },
    //                 body : JSON.stringify({
    //                     emailContent: emailContent,
    //                     tone: "professional"
    //                 })
    //             });

    //             if(!response.ok){
    //                 throw new Error('API Request Failed');
    //             }

    //             const generatedReply = await response.text();
    //             const composeBox = document.querySelector('[roll = "textbox"], [g_editable="true"]');

    //             if(composeBox){
    //                 composeBox.focus();
    //                 document.execCommand('insertText', false, generatedReply);
    //             }else{
    //                 console.error('Compose box was not found');
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             alert('Failed to generate reply');
    //         }finally{
    //             button.innerHTML = 'AI Reply';
    //             button.disabled = false;
    //         }
    //     })

    //     toolbar.insertBefore(button, toolbar.firstChild);
    // }


    // // creating an instance of MutationObserver. 
    // //It is a class provided by the DOM API to observe and 
    // //react to changes in the DOM tree, such as when elements are added, removed, or modified.
    
    // // (mutation) => { ... } is a callback function.
    // //mutations refers to an array of MutationRecord objects. 
    // //Each MutationRecord represents a single change or "mutation" that occurred in the DOM during the observation period.
    // const observer = new MutationObserver((mutations) =>{
    //     for(const mutation of mutations){
    //         const addedNode = Array.from(mutation.addedNodes);
    //         const hasComposeElements = addedNode.some(node =>
    //             node.nodeType === Node.ELEMENT_NODE &&
    //             (node.matches('.aDg, .HE, .aDh, .btC, [role="dialog"]') || node.querySelector('.aDg, .HE, aDh, .btC, [role="dialog"]'))
    //         );

    //         if(hasComposeElements){
    //             console.log("Compose Window Detected");
    //             setTimeout(injectButton, 500);
    //         }
    //     }
    // })

    // observer.observe(document.body, {
    //     childList:true,
    //     subtree:true
    // })

 
console.log("Email Writer Extension - Content Script Loaded");

function createAIButtonAndDropdown() {
    // Create a wrapper for the button and dropdown
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginRight = '8px';

    // Create the AI Reply button
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO T-I-atl L3'; // Matches Gmail's Send button
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';

    // Create the tone selection dropdown
    const dropdown = document.createElement('select');
    dropdown.className = 'ai-tone-dropdown';
    dropdown.style.marginRight = '8px';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.padding = '5px';
    dropdown.style.borderRadius = '4px';

    // Add the default "Tone" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'tone';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    // Add tone options
    const tones = ['professional', 'friendly', 'casual', 'none'];
    tones.forEach(tone => {
        const option = document.createElement('option');
        option.value = tone;
        option.innerText = tone.charAt(0).toUpperCase() + tone.slice(1);
        dropdown.appendChild(option);
    });

    // Append dropdown and button to the wrapper
    wrapper.appendChild(dropdown);
    wrapper.appendChild(button);

    return { wrapper, button, dropdown };
}

function getEmailContent() {
    const selectors = ['.h7', 'a3s.aiL', '.gmail_quote', '[role="presentation"]'];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = ['.aDg', '.HE', '.aDh', '.btC', '[role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function injectButtonAndDropdown() {
    const existingWrapper = document.querySelector('.ai-reply-wrapper');
    if (existingWrapper) existingWrapper.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button and dropdown");
    const { wrapper, button, dropdown } = createAIButtonAndDropdown();
    wrapper.classList.add('ai-reply-wrapper');

    button.addEventListener('click', async () => {
        try {
            const selectedTone = dropdown.value || 'professional'; // Default to professional if none is selected
            if (!selectedTone) {
                alert('Please select a tone before generating a reply.');
                return;
            }

            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone === 'none' ? 'professional' : selectedTone, // Fallback to professional for 'none'
                }),
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"], [g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(wrapper, toolbar.firstChild);
}

// Observe DOM changes to detect compose windows
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(
            node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.matches('.aDg, .HE, .aDh, .btC, [role="dialog"]') || node.querySelector('.aDg, .HE, .aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButtonAndDropdown, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
