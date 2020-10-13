function addReplaceParameter(url, key, newSource){
    var chunks = url.split("?");
    url = chunks[0];
    var query = "";
    if(chunks.length>1){
        var pairs = chunks[1].split("&");
        for(var i=0;i<pairs.length;i++){
            var skey = pairs[i].split("=")[0];
            if(skey!=key){
               if(query!==""){
                    query+="&";
               }
               query+=pairs[i];
            }
        }
    }
    if(query!==""){
        query+="&";
    }
    query +=key+"="+encodeURIComponent(newSource);
    return url+"?"+query;
}
document.forms[0].action = addReplaceParameter(document.forms[0].action,"Source","https://axogeninc.sharepoint.com/SitePages/Home.aspx");