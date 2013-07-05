
function httpGet(url){
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getStrapdownScriptTag(document){
    var scriptEls = document.getElementsByTagName('script');
    for (var i = 0; i < scriptEls.length; i++) {
        if (scriptEls[i].src.match('strapdown')) {
          return scriptEls[i];
        }
    }
}

function getMarkdownEl(document){
    var ret;
    ret = document.getElementsByTagName('xmp')[0];
    if(ret){
        return ret;
    }
    ret = document.getElementsByTagName('textarea')[0];
    if(ret){
        return ret;
    }
    var scriptEl = getStrapdownScriptTag(document);
    return createMarkdownElFromScriptData(scriptEl.attributes);
}

function createMetaTagInHeader(document){
    var metaEl = document.createElement('meta');
    metaEl.name = 'viewport';
    metaEl.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0';
    if (document.head.firstChild){
        document.head.insertBefore(metaEl, document.head.firstChild);
    }
    else{
        document.head.appendChild(metaEl);
    }
}

function getWantedTheme(document){
    var markdownEl = getMarkdownEl(document);
    var theme = markdownEl.getAttribute('theme') || 'bootstrap';
    return theme.toLowerCase();
}

function createStyleSheet(document, href){
    var linkEl = document.createElement('link');
    linkEl.href = href
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
}

function createdNeededStyleSheets(document){
    var path = '/themes/'+getWantedTheme(document) +'.min.css';
    createStyleSheetWithRelativePath(document, path);
    path = '/strapdown.css';
    createStyleSheetWithRelativePath(document, path);
    path = '/themes/bootstrap-responsive.min.css';
    createStyleSheetWithRelativePath(document, path);
}

function createStyleSheetWithRelativePath(document, relativeHref){
    var path = getPathRelativlyToStrapdownScript(document, relativeHref);
    createStyleSheet(document, path);
}

function getPathOfTheStrapdownScript(document){
    var script = getStrapdownScriptTag(document);
    return script.src.substr(0, script.src.lastIndexOf('/'));
}

function getPathRelativlyToStrapdownScript(document, path){
    var script = getPathOfTheStrapdownScript(document);
    if(path.substr(0,1) === "/"){
        return script + path;
    }
    return script + "/" + path;
}

function createMarkdownElFromScriptData(attributes){
    if(!"data-src" in attributes){
        return null;
    }
    var elm = document.createElement("xmp");
    for(var i = 0; i < attributes.length; i++){
        var attr = attributes[i];
        if(attr.name.substr(0, 5) == "data-" && attr.name !== "data-src"){
            elm.setAttribute(attr.name.substr(5), attr.value);
        }
    }
    elm.innerHTML = httpGet(attributes["data-src"].value);
    var body = document.getElementsByTagName("body")[0]
    body.appendChild(elm);
    return elm
}

function getTitle(document){
    return document.getElementsByTagName('title')[0];
}

function hasTitle(document){
    return !!getTitle(document);
}

function hasNavbar(document){
    return !!document.getElementsByClassName('navbar')[0];
}

function createNavbarIfRequired(document){
    var newNode = document.createElement('div');
    newNode.className = 'navbar navbar-fixed-top';
    if (!hasNavbar(document) && hasTitle(document)) {
        newNode.innerHTML = '<div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> </div> </div>';
        document.body.insertBefore(newNode, document.body.firstChild);
        var title = getTitle(document).innerHTML;
        var headlineEl = document.getElementById('headline');
        if (headlineEl){
            headlineEl.innerHTML = title;
        }
    }
}

function prettyfyEmbededCodeBlocks(document){
    var codeEls = document.getElementsByTagName('code');
    for (var i=0, ii=codeEls.length; i<ii; i++) {
        var codeEl = codeEls[i];
        var lang = codeEl.className;
        codeEl.className = 'prettyprint lang-' + lang;
    }
    prettyPrint();
}

function styleEmbededTables(document){
    var tableEls = document.getElementsByTagName('table');
    for (var i=0, ii=tableEls.length; i<ii; i++) {
        var tableEl = tableEls[i];
        tableEl.className = 'table table-striped table-bordered';
    }
}

function generateMarkdown(markdown, node){
    var html = marked(markdown);
    node.innerHTML = html;
}

function createMarkdownHtmlFromMarkdownTag(document){
    var markdownEl = getMarkdownEl(document);
    var markdown = markdownEl.textContent || markdownEl.innerText;

    var newNode = document.createElement('div');
    newNode.className = 'container';
    newNode.id = 'content';
    document.body.replaceChild(newNode, markdownEl);
    generateMarkdown(markdown, newNode);
}

function removeElement(document, elm){
    elm.parentNode.removeChild(elm);
}

function getFullPath(document, path){
    if(path.substr(0,1) == "/"){
        path = path.substr(1);
    }
    return document.location.href + path;
}

function getMarkdown(document, path){
    var fullpath = getFullPath(document, path);
    return httpGet(fullpath);
}

function removeOldPage(document){
    $("xmp,.container,.navbar").each(function(){
        removeElement(document, this);
    }
    );
}

function remakeInitialPage(document, markdown){
    var xmp = document.createElement("xmp");
    xmp.innerHTML = markdown;
    xmp.setAttribute("style", "display:none;");
    $("body").prepend(xmp)
}

function reloadPage(document){
    createMarkdownHtmlFromMarkdownTag(document);
    createNavbarIfRequired(document);
    prettyfyEmbededCodeBlocks(document);
    styleEmbededTables(document);
}

function loadMarkdownFromFilePath(path){
    var markdown = getMarkdown(document, path);
    if(markdown){
        document.body.style.display = 'none';
        removeOldPage(document);
        remakeInitialPage(document, markdown)
        reloadPage(document)
        document.body.style.display = '';
    }
}

(function(window, document) {
    document.body.style.display = 'none';
    createMetaTagInHeader(document);
    createdNeededStyleSheets(document);
    createMarkdownHtmlFromMarkdownTag(document);
    createNavbarIfRequired(document);
    prettyfyEmbededCodeBlocks(document);
    styleEmbededTables(document);
    document.body.style.display = '';

})(window, document);
