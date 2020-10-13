function FieldsManager() {
    var currentUser = null;
    var userProfileProperties = null;
    var context = new SP.ClientContext.get_current();

    function setPickerValue(pickerid, key, dispval) {
        var xml = '<Entities Append="False" Error="" Separator=";" MaxHeight="3">';
        xml += '<Entity Key="' + key + '" DisplayText="' + dispval + '" IsResolved="True" Description="' + key + '"><MultipleMatches /></Entity>';
        xml += '</Entities>';
        EntityEditorCallback(xml, pickerid, true);
    }

    function loadUserProfile(managerFieldName){
        $.ajax({
            url: "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                // Find required property
                data = data.d;
                userProfileProperties = data.UserProfileProperties.results;
                var l = userProfileProperties.length;
                // Change to what you need
                var managerKey = "Manager";
                var managerLogin = "";
                for(var i =0; i< l;i++){
                    if(userProfileProperties[i].Key == managerKey){
                        managerLogin = userProfileProperties[i].Value;
                        break;
                    }
                }
                if(managerLogin!==""){
                    // We need to obtain display name for manager
                    ensureUser(managerLogin,managerFieldName);
                }
            },
            error: function(error) {
                alert(error);
            }
        });
    }

    function ensureUser(loginName,managerFieldName){
        var user = context.get_web().ensureUser(loginName);
        context.load(user);
        context.executeQueryAsync(function(){
            var selector = "[id*=" + managerFieldName + "][id$='UserField']";
            var pickerId = $(selector)[0].id;
            var displayName = user.get_title();
            console.log("Manager: "+displayName +" ("+loginName+")");
            // Set Manager field
            setPickerValue(pickerId, loginName, displayName);
       },onRequestFail);
    }

    this.setFieldWithCurrentUser = function (fieldName, managerFieldName) {
        var web = context.get_web();
        currentUser = web.get_currentUser();
        context.load(currentUser);
        context.executeQueryAsync(function () {
            var selector = "[id*=" + fieldName + "][id$='UserField']";
            var pickerId = $(selector)[0].id;
            var loginName = currentUser.get_loginName();
            var displayName = currentUser.get_title();
            console.log("User: "+displayName +" ("+loginName+")");
            setPickerValue(pickerId, loginName, displayName);
        }, onRequestFail);
        loadUserProfile(managerFieldName);
    };
    function onRequestFail(sender, args){
        alert(args.get_message() + '\r\n' + args.get_stackTrace());
    }
}

// Wait for SP.js
ExecuteOrDelayUntilScriptLoaded(function(){
    var man = new FieldsManager();
    man.setFieldWithCurrentUser("Employee_x0020_Name","Manager");
},"sp.js");
