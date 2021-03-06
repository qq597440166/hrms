/*====================django ajax ======*/

jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

/*===============================django ajax end===*/

$(document).ready(function()
{

    // 检测输入的内容是否符合所需内容
    // type： 原始类型
    // value： 需要检测的值
    // return: boolean
    function checkInputType(type, value)
    {
        var reg;
        if(type == 'mac')
        {
            reg = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
        }
        else if(type == 'dogport')
        {
            reg = /^\d{0,3}[^&]?\d{0,3}$/;
        }
        else if(type == 'dogsn')
        {
            reg = /^[0-9a-zA-Z]{0,20}[^&]?[0-9a-zA-Z]{0,20}$/;
        }
        else if(type == 'ip')
        {
            reg = /^((25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/;
        }
        else if(type == 'date')
        {
            reg = /^[0-1]?[0-9]\/[0-3]?[0-9]\/2[0-1][0-9][0-9]$/;
        }
        else
        {
            reg = /^.*$/;
        }
        return reg.test(value);
    }


    var container = $('div#container');

    $(window).resize(function()
    {// 桌面根据浏览器大小自动调整
        var docWidth = $(document.body).width();
        container.css({
            width: docWidth,
        });        
    });

    var desk = $('div#desk');
    desk.sortable();
    desk.disableSelection();

    // 在桌面添加一个icon
    // id: 需要指定该icon的id
    // iconPath: 需要指定该icon图片的路径
    // name: 该icon的名字，可忽略
    function addIcon(id, iconPath, name)
    {
        if(name == undefined)
        {
            name = "icon";
        }
        var iconHtml = "<div class = 'icon'>" +
            "<img class = 'iconBody' id = '" + id + "' src = '" + iconPath + "'/>" +
            "<input class = 'iconName' value = '" + name + "'/></div>";        
        desk.append(iconHtml);
    }

    addIcon('allVms', '/static/desk/icons/test.png', gettext('all instances'));
    addIcon('addVm', '/static/desk/icons/test.png', gettext('add instance'));
    addIcon('addBusinessMan', '/static/desk/icons/test.png', gettext('add owner'));
    addIcon('addNode', '/static/desk/icons/test.png', gettext('add node'));
    addIcon('addIp', '/static/desk/icons/test.png', gettext('add ip'));
    addIcon('addPort', '/static/desk/icons/test.png', gettext('add dog port'));
    addIcon('addMac', '/static/desk/icons/test.png', gettext('add mac'));
    addIcon('user', '/static/desk/icons/test.png', gettext('user'));
    addIcon('log', '/static/desk/icons/test.png', gettext('log'));


    var deskDialog = $('.ui-dialog');
    deskDialog.hide();
    var allIcon = $('img#allVms');
    var deskAllVms = $('div#deskAllVms');
    allIcon.click(getAll);
    function getAll()
    {
        $.post("/static/hrmsapp/all.js", '', function(receive){$(body).append()});
    }
    function getAll()
    {// 所有实例的icon
        $.post('/vm/', 'item=all', renderAll);
        
        var _dialog = {
            title: gettext("all instances"),
            resizable: true,
            modal: false,
            width: 1300,
            height: 500,
            buttons: {}
        };
        _dialog.buttons[gettext("Cancel")] = function() {
            $(this).dialog("close");
        }
        deskAllVms.dialog(_dialog);
    }

    var hostsDiv = $('div#hostsDiv');
    function renderAll(receive)
    { // 渲染所有实例项目
        hostsDiv.empty();
        hostsDiv.append(receive);
        var hostsDivWidth = 0;
        $('div.aHostItem').first().children().each(function()
        {
            hostsDivWidth += $(this).width();
        });
        hostsDiv.css('width', hostsDivWidth + 'px');
        var starttime = $('.start');
        var endtime = $('.end');
        starttime.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function(selectedDate) {
                endtime.datepicker("option", "minDate", selectedDate);
            }
        });
        endtime.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function(selectedDate) {
                starttime.datepicker("option", "maxDate", selectedDate);
            }
        }); 

        var nodeSelector = $('.node');
        nodeSelector.click(__allNodes);
        function __allNodes()
        {
            thisSelector = $(this);
            $.post('/vm/nodes/', 'item=nodes', __renderNodes);
            function __renderNodes(receive)
            {
                thisSelector.empty();
                thisSelector.append(receive);
            }
        }

        $('div#hosts').children().filter(':odd').each(function()
        {
            $(this).css('background-color', '#1681B8');
        });
        
    }

    var addIcon = $('img#addVm');
    var deskAddVm = $('div#vmItemDiv');
    deskAddVm.hide();
    var starttime = $('input#startTime');
    var endtime = $('input#endTime');
    addIcon.click(addIconClick);
    function addIconClick()
    {// 添加实例的icon
        renderNodes();
        renderIps();
        renderMacs();
        renderOwners();
        var thisNode = $('select#node');
        thisNode.change(function()
        {
            renderPorts($(this).val());
        }); 
        $('select#dogPort').change(function()
        {
            if($('select#dogPort').val() == '')
            {
                $('input#dogSn').attr('disabled', 'true');
                $('input#dogSn').val() = '';
            }
            else
            {
                $('input#dogSn').removeAttr('disabled');
            }
        });

        var _dialog  = {
            title: gettext("add instance"),
            resizable: false,
            modal: false,
            width: 350,
            buttons: {}
        };
        _dialog.buttons[gettext("Submit")] = __addHost
        deskAddVm.dialog(_dialog);

        function __addHost()
        {
            var vmName = $('input#vmName');
            var vcpus = $('input#vcpus');
            var mem = $('input#mem');
            var disk = $('input#disk');
            var startTime = $('input#startTime');
            var endTime = $('input#endTime');
            var bandwidth = $('input#bandwidth');
            var company = $('input#company');
            var dogSn = $('input#dogSn');
            var dogPort = $('select#dogPort');
            var node = $('select#node');
            var ip = $('select#ip');
            var mac = $('select#mac');
            var businessMan = $('select#businessMan');

            
            $.post('/vm/add/',
                'vmname=' + vmName.val() +
                '&vcpus=' + vcpus.val() +
                '&mem=' + mem.val() +
                '&datadisk=' + disk.val() +
                '&nodehost=' + node.val() +
                '&starttime=' + startTime.val() +
                '&endtime=' + endTime.val() +
                '&bandwidth=' + bandwidth.val() +
                '&company=' + company.val() +
                '&dogsn=' + dogSn.val() +
                '&dogport=' + dogPort.val() +
                '&ip=' + ip.val() +
                '&mac=' + mac.val() +
                '&businessman=' + businessMan.val(),
                __isSaved
            );
            function __isSaved(receive)
            {
                var vmItemDiv = $('div#vmItemDiv');
                if (receive == 'successful')
                {
                    vmItemDiv.css('border', '1px solid rgb(0, 255, 0)');
                    addIconClick();
                }
                else
                {
                    vmItemDiv.css('border', '1px solid rgb(255, 0, 0)');
                }
            }
        }
        starttime.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function(selectedDate) {
                endtime.datepicker("option", "minDate", selectedDate);
            }
        });
        endtime.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function(selectedDate) {
                starttime.datepicker("option", "maxDate", selectedDate);
            }
        });        
    }

    var ownerSelector = $('select#businessMan');
    function renderOwners()
    { // 渲染所有businessMan
        $.post('/vm/owners/', 'item=owners', __renderOnwers);
        function __renderOnwers(receive)
        {
            ownerSelector.empty();
            ownerSelector.append(receive);
        }
    }

    var nodeSelector = $('select#node');
    function renderNodes()
    { // 渲染所有node
        $.post('/vm/nodes/', 'item=nodes', __renderNodes);
        function __renderNodes(receive)
        {
            nodeSelector.empty();
            nodeSelector.append(receive);
            renderPorts($('select#node').val());
        }
    }

    var ipSelector = $('select#ip');
    function renderIps()
    { // 渲染所有ip
        $.post('/vm/ips/', 'item=ips', __renderIps);
        function __renderIps(receive)
        {
            ipSelector.empty();
            ipSelector.append(receive);
        }
    }

    var macSelector = $('select#mac');
    function renderMacs()
    { // 渲染所有mac
        $.post('/vm/macs/', 'item=macs', __renderMacs);
        function __renderMacs(receive)
        {
            macSelector.empty();
            macSelector.append(receive);
        }
    }

    var portsSelector = $('select#dogPort');
    function renderPorts(node)
    { // 渲染所有dog port
        $.post('/vm/dogports/', 'node=' + node, __renderPorts);
        function __renderPorts(receive)
        {
            portsSelector.empty();
            portsSelector.append(receive);            
        }
    }

    var addNodeIcon = $('img#addNode');
    var deskAddNode = $('div#deskAddNode');
    deskAddNode.hide();
    addNodeIcon.click(function()
    { // 添加node的icon
        var newNodeInput = $('input[name=newNode]');
        
        var _dialog = {
            title: gettext("add node"),
            resizable: false,
            modal: false,
            buttons: {}
        };
        _dialog.buttons[gettext("Submit")] = function() {
            if(checkInputType('ip', newNodeInput.val()))
            {
                $.post('/vm/addnode/', 'newNode=' + newNodeInput.val(), isSaved)
            }
            else
            {
                isSaved('failed');
            }
        };
        deskAddNode.dialog(_dialog);

        function isSaved(receive)
        {
            if (receive == 'successful')
            {
                newNodeInput.css('border', '1px solid rgb(0, 255, 0)');
            }
            else
            {
                newNodeInput.css('border', '1px solid rgb(255, 0, 0)')
            }
        }        

    });

    var addOwnerIcon = $('img#addBusinessMan');
    var deskAddOwner = $('div#deskAddOwner');
    deskAddOwner.hide();
    addOwnerIcon.click(function()
    { // 添加node的icon
        var newOwnerInput = $('input[name=newOwner]');
        
        var _dialog = {
            title: gettext("add owner"),
            resizable: false,
            modal: false,
            buttons: {}
        };
        _dialog.buttons[gettext('Submit')] = function() {
            if(checkInputType('ip', newOwnerInput.val()))
            {
                $.post('/vm/addowner/', 'newOwner=' + newOwnerInput.val(), __isSaved)
            }
            else
            {
                __isSaved('failed');
            }
        }
        deskAddOwner.dialog(_dialog);

        function __isSaved(receive)
        {
            if (receive == 'successful')
            {
                newOwnerInput.css('border', '1px solid rgb(0, 255, 0)');
            }
            else
            {
                newOwnerInput.css('border', '1px solid rgb(255, 0, 0)')
            }
        }        

    });

    var addIpIcon = $('img#addIp');
    var deskAddIp = $('div#deskAddIp');
    deskAddIp.hide();
    addIpIcon.click(function()
    { // 添加ip的icon
        var newIpInput = $('input[name=newIp]');
        
        var _dialog = {
            title: gettext("add ip"),
            resizable: false,
            modal: false,
            buttons: {}
        };
        _dialog.buttons[gettext('Submit')] = function() {
            if(checkInputType('ip', newIpInput.val()))
            {
                $.post('/vm/addip/', 'newIp=' + newIpInput.val(), isSaved)
            }
            else
            {
                isSaved('failed');
            }
        };
        deskAddIp.dialog(_dialog);

        function isSaved(receive)
        {
            if (receive == 'successful')
            {
                newIpInput.css('border', '1px solid rgb(0, 255, 0)');
            }
            else
            {
                newIpInput.css('border', '1px solid rgb(255, 0, 0)')
            }
        }    
    });

    var addMacIcon = $('img#addMac');
    var deskAddMac = $('div#deskAddMac');
    deskAddMac.hide();
    addMacIcon.click(function()
    { // 添加mac的icon
        var newMacInput = $('input[name=newMac]');
        
        var _dialog = {
            title: gettext("add mac"),
            resizable: false,
            modal: false,
            buttons: {}
        };
        _dialog.buttons[gettext('Submit')] = function() {
            if(checkInputType('mac', newMacInput.val()))
            {
                $.post('/vm/addmac/', 'newMac=' + newMacInput.val(), isSaved)
            }
            else
            {
                isSaved('failed');
            }
        }
        deskAddMac.dialog(_dialog);

        function isSaved(receive)
        {
            if (receive == 'successful')
            {
                newMacInput.css('border', '1px solid rgb(0, 255, 0)');
            }
            else
            {
                newMacInput.css('border', '1px solid rgb(255, 0, 0)')
            }
        }    
    });


    var addPortIcon = $('img#addPort');
    var deskAddPort = $('div#deskAddPort');
    deskAddPort.hide();
    addPortIcon.click(function()
    { 
        var thisNode = $('select#allNodes');
        thisNode.empty();
        var newDogPortInput = $('input[name=newPort]');
        dealReceive();
        function dealReceive()
        {   
            $(this).empty();
            $.post('/vm/nodes/', 'item=nodes', _dealReceive);
            function _dealReceive(receive)
            {
                var thisNodes = $('select#allNodes');
                thisNodes.append(receive);
            }
        };
        
        var _dialog = {
            title: gettext("add dog port"),
            resizable: false,
            modal: false,
            buttons: {}
        };
        _dialog.buttons[gettext('Submit')] = function() {
            if (thisNode == '')
            {
                thisNode.css('border', '1px solid rgb(255, 0, 0)');
            }
            else
            {
                $.post('/vm/adddog/',
                    'dogPort=' + newDogPortInput.val() +
                    '&node=' + thisNode.val(),
                    isSaved);
            }
        };
        deskAddPort.dialog(_dialog);

        function isSaved(receive)
        {
            if (receive == 'successful')
            {
                newDogPortInput.css('border', '1px solid rgb(0, 255, 0)');
            }
            else
            {
                newDogPortInput.css('border', '1px solid rgb(255, 0, 0)')
            }
        } 
    });


    var userIcon = $('img#user');
    var deskUser = $('div#deskUser');
    deskUser.hide();
    userIcon.click(function()
    { // user的icon
        $('div#usersDiv').empty();
        
        var _dialog = {
            title: gettext("users"),
            resizable: true,
            modal: false,
            width: 1190,
            height: 300,
            close: function(){$(this).dialog("destroy")},
            buttons: {}
        };
        _dialog.buttons[gettext('Submit')] = function() {
            $(this).dialog("destroy");
        }
        _dialog.buttons[gettext('Register')] = function() {
            $('form[name=register]').css('background-color', '#ffffff');
            $('input#usernameInput').removeClass().addClass('notRegistered').val('');
            $('input#passwordInput').css({
                'border': '1px solid #A9A8A8',
                'width': '100%'
            }).val('');
            $('input#pswdConfirmInput').css({
                'border': '1px solid #A9A8A8',
                'width': '100%'
            }).val('');

            var registerDialog = $('div#registerDialogDiv');
            
            var _dialogInner = {
                title: gettext("register"),
                modal: true,
                resizable: false,
                focus: function() {
                    $(this).css('background-color', '#ffffff');
                },
                close: function(){$(this).dialog("destroy")},
                buttons: {}
            };
            _dialogInner.buttons[gettext('Submit')] = function() {
                var usernameInput = $('input#usernameInput');
                var passwordInput = $('input#passwordInput');
                var pswdConfirmInput = $('input#pswdConfirmInput');
                if(usernameInput.val() != '')
                {
                    if (passwordInput.val() == pswdConfirmInput.val())
                    {
                        if(passwordInput.val() == '' || pswdConfirmInput == '')
                        {
                            passwordInput.css('border', '1px solid rgb(255, 0, 0)');
                            pswdConfirmInput.css('border', '1px solid rgb(255, 0, 0)');
                        }
                        else
                        {
                            $.post('/login/register/', 'username=' + usernameInput.val() + '&password=' + passwordInput.val(), __isSaved);
                            function __isSaved(receive)
                            {
                                if(receive == 'successful')
                                {
                                    $('form[name=register]').css('background-color', '#00ff00');
                                }
                                else
                                {
                                    $('form[name=register').css('background-color', '#ff00ff');
                                }
                            }
                            
                        }
                    }
                    else
                    {
                        pswdConfirmInput.css('border', '1px solid rgb(255, 0, 0)');
                    }
                }
            }
            _dialogInner.buttons[gettext('Close')] = function() {
                $(this).dialog('destroy');
            }
            registerDialog.dialog(_dialogInner);
            
            // 注册对话框中的用户名输入框失焦时，向服务器判断该用户名是否已被注册
            var usernameInput = $('input#usernameInput');
            var passwordInput = $('input#passwordInput');
            var pswdConfirmInput = $('input#pswdConfirmInput');
            usernameInput.focus(function()
                {
                    $(this).css('width', '100%');
            });
            passwordInput.focus(function()
            {
                $(this).css({
                    'width': '100%',
                    'border': '1px solid #A9A8A8'
                });
            });
            pswdConfirmInput.focus(function()
            {
                $(this).css({
                    'width': '100%',
                    'border': '1px solid #A9A8A8'
                });
            });
            usernameInput.blur(checkUser);
            function checkUser()
            {
                if (usernameInput.val() != '')
                {
                    $.post('/login/checkuser/', 'username=' + usernameInput.val(), __isRegister);
                }
                else
                {
                    usernameInput.removeClass('isRegistered notRegistered');
                }
                // 如果该用户名已被注册，将注册对话框的边框设置为红色, 如果未被注册，设置为绿色
                function __isRegister(receive)
                {
                    if (receive == 'failed')
                    {
                        usernameInput.removeClass().addClass('isRegistered');
                    }
                    else if (receive == 'successful')
                    {
                        usernameInput.removeClass().addClass('notRegistered')
                    }
                }
            }
        }

        deskUser.dialog(_dialog);

        $.post('/user/', 'user=all', renderUsers);
        function renderUsers(receive)
        {
            var thisUser;
            var oldQuery = ',';
            var oldModify = ',';
            var newQuery = ',';
            var newModify = ',';
            var usersDiv = $('div#usersDiv')
            usersDiv.append(receive);

            var permItem = $('input.aUserPermissionItem');
            $('div.aUserPermissionDiv').mouseenter(function()
            {
                thisUser = $(this);
                var oldQueryChecked = thisUser.children().children().children().filter('.queryItem').filter(':checked');
                var oldModifyChecked = thisUser.children().children().children().filter('.modifyItem').filter(':checked');
                oldQueryChecked.each(function()
                {
                    oldQuery += $(this).attr('name') + ',';
                });
                oldModifyChecked.each(function()
                {
                    oldModify += $(this).attr('name') + ',';
                });
            });
            permItem.change(function()
            {
                thisChecked = $(this);
                newQuery = ',';
                newModify = ',';
                var newQueryChecked = thisUser.children().children().children().filter('.queryItem').filter(':checked');
                var newModifyChecked = thisUser.children().children().children().filter('.modifyItem').filter(':checked');
                newQueryChecked.each(function()
                {
                    newQuery += $(this).attr('name') + ',';
                });
                newModifyChecked.each(function()
                {
                    newModify += $(this).attr('name') + ',';
                });

                $.post('/user/changeperm/',
                    'username=' + thisUser.attr('id') +
                    '&oldquery=' + oldQuery +
                    '&newquery=' + newQuery +
                    '&oldmodify=' + oldModify +
                    '&newmodify=' + newModify,
                    isSaved);

                function isSaved(receive)
                {
                    if(receive == 'successful')
                    {
                        thisChecked.parent().css('background-color', '#00ff00');
                    }
                    else
                    {
                        thisChecked.parent().css('background-color', "ff0000");
                    }
                }
            });

            $('div.aUserPermissionDiv').mouseleave(function()
            {
                oldQuery = ',';
                oldModify = ',';
                newQuery = ',';
                newModify = ',';
            });
        }
    });

    
    var logIcon = $('img#log');
    var deskLogDiv = $('div#deskLogDiv');
    deskLogDiv.hide();
    logIcon.click(function()
    { // log 的icon
        
        var _dialog = {
            title: gettext("log"),
            resizable: true,
            modal: false,
            width: 1000,
            height: 500,
            close: function(){$(this).dialog("close")},
            buttons: {}
        };
        _dialog.buttons[gettext('log')] = function() {
            var conditionLogDiv = $('div#conditionLogDiv');
            
            var _dialogInner = {
                title: gettext("log query"),
                resizable: true,
                modal: true,
                width: 230,
                height: 230,
                close: function(){$(this).dialog("destroy")},
                buttons: {}   
            };
            _dialogInner.buttons[gettext('Submit')] = function() {
                var hostName = $('select#logQueryHostName').val();
                var startTime = $('input#logQueryStartTime').val();
                var endTime = $('input#logQueryEndTime').val();
                $.post(
                    'log/conditionlog/',
                    'hostname=' + hostName +
                    '&starttime=' + startTime +
                    '&endtime=' + endTime,
                    __query
                    )
                function __query(receive)
                {
                    deskLogDiv.empty();
                    deskLogDiv.append(receive); 
                }
            }
            conditionLogDiv.dialog(_dialogInner);
            
            var vmNameSelector = $('select#logQueryHostName');
            $.post('/log/vmnames/', '', renderVmNames);
            function renderVmNames(receive)
            {
                vmNameSelector.empty();
                vmNameSelector.append(receive);
            }
            
            function getDate()
            {
                var date = new Date();
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var day = date.getDate()
                return month + "/" + day + "/" + year;
            }

            var logQueryStartTime = $('input#logQueryStartTime');
            var logQueryEndTime = $('input#logQueryEndTime');
            logQueryStartTime.val(getDate);
            logQueryEndTime.val(getDate);
            logQueryStartTime.datepicker({
                altFormat: "mm/dd/yy",
                defaultDate: +0,
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function(selectedDate)
                    {
                        logQueryEndTime.datepicker("option", "minDate", selectedDate)
                    }
            });
            logQueryEndTime.datepicker({
                altFormat: "mm/dd/yy",
                defaultDate: +0,
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function(selectedDate)
                    {
                        logQueryStartTime.datepicker("option", "maxDate", selectedDate)
                    }
            });
        }
        deskLogDiv.dialog(_dialog);

        $.post('/log/', '', renderLogs);
        function renderLogs(receive)
        {
            deskLogDiv.empty();
            deskLogDiv.append(receive);
        }
    });
});