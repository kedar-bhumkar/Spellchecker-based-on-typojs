

  var typo =new Typo("en_US", false, false, { dictionaryPath: "./dict" });      
  function isWordSpelledCorrectly(word){
    return typo.check(word);
  }

  function offerSuggestions(word){
    return typo.suggest(word)
  }

  
  const textDivs = document.getElementsByClassName('spell-check')  
  Array.from(textDivs).forEach(textDiv=> {
    textDiv.addEventListener('input', function(event) {
        const textBox = event.target;
        const text = textBox.innerText.split(/(\s+)/); // Split text by words and spaces

        // Save cursor position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;

        const wordsHTML = text.map(word => {
        // Preserve spaces as plain text
        if (word.trim().length === 0) {
            return word;
        }
        // Wrap words in span and underline if necessary
        const span = document.createElement('span');
        span.innerText = word;
        if (word.length > 3) {
            var isWordCorrect = isWordSpelledCorrectly(word)
            console.log('isWordCorrect = '+ isWordCorrect)
            if(!isWordCorrect){
            span.classList.add('underline-red');            
            }
        }
        return span.outerHTML;
        }).join('');

        textBox.innerHTML = wordsHTML;
        placeCaretAtEnd(textDiv);
    })

  });

    Array.from(document.getElementsByClassName('spell-check')).forEach(textDiv=>{ 
        
        textDiv.addEventListener('mouseover', function(event) {
    
        if (event.target.classList.contains('underline-red')) {
        showTooltip(event);
        }
    })
    });

    Array.from(document.getElementsByClassName('spell-check')).forEach(textDiv=>{ 
        
        textDiv.addEventListener('mouseout', function(event) {
    
        if (event.target.classList.contains('underline-red')) {
        //hideTooltip(event);
        }
    })
    });

  function showTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    const word = event.target.innerText;


      var alternatives = offerSuggestions(event.target.innerText)
      console.log('alternatives = ' + alternatives)
      if(alternatives == '' || alternatives ==null){
        return;
      }
      const suggestions = String(alternatives).split(',');
      tooltip.innerHTML = ''; // Clear previous suggestions
      suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.innerText = suggestion;
        div.addEventListener('click', () => {
          event.target.innerText = suggestion; // Replace word
          tooltip.style.display = 'none'; // Hide tooltip
          event.target.classList.remove('underline-red')
        });
        tooltip.appendChild(div);
      });
      const rect = event.target.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.bottom + window.scrollY}px`;
      tooltip.style.display = 'block';

  }

  function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  }


  document.addEventListener('click', function(event) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip.contains(event.target) && !event.target.classList.contains('underline-red')) {
      tooltip.style.display = 'none';
    }
  });    

  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}    