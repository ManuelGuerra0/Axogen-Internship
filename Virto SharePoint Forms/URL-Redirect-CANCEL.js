function virtoOnCancel(evnt){
    // This is dialog
    if(window.frameElement){
        window.parent.STSNavigate(evnt.data.url);
        window.frameElement.ClosePopUp();
    }else{
        window.STSNavigate(evnt.data.url);
    }
    return false;
}
function redirectOnCancel(url){
    var a = {url: url};
    // Ribbon Button
    $('a[id="Ribbon.ListForm.Edit.Commit.Cancel-Large"]').click(a,virtoOnCancel);
    // Bottom Cancel Button
    var pickerId = $("[id$='diidIOGoBack']").click(a,virtoOnCancel);
}
redirectOnCancel("https://axogeninc.sharepoint.com/SitePages/Home.aspx");
