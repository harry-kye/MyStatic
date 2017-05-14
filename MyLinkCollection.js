//$(document).ready(function (e) {
//    $('#searchID').keypress(function (e) {
//        var keycode = (e.keyCode ? e.keyCode : e.which);
//        if (keycode === 13) {
//            $('#searchButtonID').click();
//            //Search('');
//        }
//    });
    //});

function handleKeydown(event) {
    var keyCode = event.keyCode ? event.keyCode : event.which;
    if (keyCode === 13) {
        //$('#searchButtonID').click();
        Search('');
        //$('#searchID').focus();
    } 
    // if i detect the tab key and stay focus on the search fox
    // there is no way to get to actual links by tabbing
    // cannot do this
    //else if (keyCode === 9){
    //    $('#searchID').html(this.value);
    //    this.value = '';
    //    $('#searchID').focus();
    //    event.preventDefault();
    //}
}

function loadXMLDoc(dname)
{
    if (window.ActiveXObject || "ActiveXObject" in window)
    {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else
    {
        xhttp=new XMLHttpRequest();
    }
    if (xhttp !== null){
        xhttp.open("GET", dname, false);

        if (xhttp.overrideMimeType)
            xhttp.overrideMimeType('text/xml');
	
        xhttp.send(null);
    }

    if (window.ActiveXObject) {
        xmlDoc = getMSXmlParser();
        xmlDoc.async = false;
        xmlDoc.loadXML(xhttp.responseText);
    }
    else {
        xmlDoc = xhttp.responseXML;
        if (!xmlDoc) {
            xmlDoc = (new DOMParser()).parseFromString(xhttp.responseText, 'text/xml');
        }
    }
    return xmlDoc;

}

function displayResult()
{
    xml=loadXMLDoc("channelitem.xml");
    xsl = loadXMLDoc("harrychannel7.xsl");
    // code for IE
    if (window.ActiveXObject || "ActiveXObject" in window)
    {
        //xsl.setProperty("AllowDocumentFunction", true);
        nex = xml.transformNode(xsl);
        document.getElementById("linkContent").innerHTML = nex;
    }
        // code for Mozilla, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor=new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById("linkContent").innerHTML = '';
        document.getElementById("linkContent").appendChild(resultDocument);
    }
}

function Search(p_id) {

    var keyword = $("#searchID").val();
    var div = $('#' + p_id);
    if (p_id !== '' && p_id !== 'xxx-xx-xxxx' && div.is(':visible')) {
        div.hide(1000);
        $('.channelNameHeader').hide(1000);
        //$('#searchID').focus();
        return;
    }
    else {

        if (p_id === '') {
            p_id = 'xxx-xx-xxxx';
            if (keyword === '') {
                var hiddenSection = $('#innerDivHidden').val();
                if (hiddenSection !== '') {
                    $('#'+hiddenSection).hide(1000);
                    $('.channelNameHeader').hide(1000);
                    //$('#searchID').focus();
                } else if ($('#' + p_id).is(':visible')) {
                    $('#' + p_id).hide(1000);
                    $('.channelNameHeader').hide(1000);
                    //$('#searchID').focus();
                }
                return;
            }
        }

        var myErr;
        if (window.ActiveXObject || "ActiveXObject" in window) {
            var xslt = new ActiveXObject("Msxml2.XSLTemplate.6.0");
            var xsldoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.6.0");
            var xslproc;
            xsldoc.async = false;
            xsldoc.load("harrychannel7.xsl");
            if (xsldoc.parseError.errorCode !== 0) {
                myErr = xsldoc.parseError;
                WScript.Echo("You have error " + myErr.reason);
            } else {
                xslt.stylesheet = xsldoc;
                var xmldoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
                xmldoc.async = false;
                xmldoc.load("channelitem.xml");
                //xmldoc.load("channel.xml");
                //xmldoc.load("item.xml");
                if (xmldoc.parseError.errorCode !== 0) {
                    myErr = xmldoc.parseError;
                    WScript.Echo("You have error " + myErr.reason);
                } else {
                    xslproc = xslt.createProcessor();
                    xslproc.input = xmldoc;
                    xslproc.addParameter("paramKeyword", keyword);
                    xslproc.addParameter("paramChannelID", p_id);
                    xslproc.transform();
                    document.getElementById("linkContent").innerHTML = xslproc.output;
                }
            }
        } // code for IE
        else {
            xml = loadXMLDoc("channelitem.xml");
            xsl = loadXMLDoc("harrychannel7.xsl");

            xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            xsltProcessor.setParameter(null, "paramKeyword", keyword);
            xsltProcessor.setParameter(null, "paramChannelID", p_id);
            resultDocument = xsltProcessor.transformToFragment(xml, document);
            document.getElementById("linkContent").innerHTML = '';
            document.getElementById("linkContent").appendChild(resultDocument);

        }
        if (keyword !== undefined && keyword !== '') {
            $('.channelNameHeader').text("Search Result for " + keyword);
        }
        ViewPage(p_id);
    }
}

function getMSXmlParser() {
    var parser = ['Msxml2.DOMDocument.6.0',
                  'Msxml2.DOMDocument.5.0',
                  'Msxml2.DOMDocument.4.0',
                  'Msxml2.DOMDocument.3.0',
                  'MSXML2.DOMDocument',
                  'Microsoft.XMLDOM']; // the same as MSXML.DOMDocument
    for (var i in parser) {
        try {
            var xParser = new ActiveXObject(parser[i]);
            if (xParser) {
                return xParser;
            }
        } catch (e) {
            continue;
        }
    }
    return null;
}
    
function ViewPage(p_id) {
    var div = $('#' + p_id);
    if (div.is(':hidden')) {
        div.show(1000);
        div.find('ul.paging').quickPagination({ pagerLocation: "both", pageSize: "7" });
        $('.channelNameHeader').show(1000);
        $('#innerDivHidden').val(p_id);
    } else {
        div.hide(1000);
        $('#innerDivHidden').val('');
    }
    $('#searchID').focus();
}

function HandleClose() {
    var referer = window.document.referrer;
    if (referer !== null) {
        self.close();
    }
}
