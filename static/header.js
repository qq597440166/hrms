$(document).ready(function()
{
    var managerDivHtml = "<div id = 'managerDiv'>" +
                             "<div id = 'managerHeader'><div id = 'managerClose'>x</div></div>" +
                             "<div id = 'userTablesDiv'>" +
                                 "<div class = 'usersTable' id = 'allUsers'>" +
                                     "<div class = 'usersTableHead' id = 'allUsersHead'>all users</div>" +
                                 "</div>" +
                                 "<div class = 'usersTable' id = 'newUsers'>" +
                                     "<div class = 'usersTableHead' id = 'newUsersHead'>new users</div>" +
                                 "</div>" +
                             "</div>" +
                             "<div id = 'managerContentDiv'>" +
                                 "<div id = 'usersContentContainer'>" +
                                     "<div class = 'usersContentDiv' id = 'allUsersContentDiv'></div>" +
                                     "<div class = 'usersContentDiv' id = 'newUsersContentDiv'></div>" +
                                 "</div>" +
                             "</div>" +
                         "</div>";
    $('div#toolbarDiv').append(managerDivHtml);
    var managerDiv = $('div#managerDiv');
    var managerHeader = $('div#managerHeader');
    var managerClose = $('div#managerClose');
    var allUsersContentDiv = $('div#allUsersContentDiv');
    var newUsersContentDiv = $('div#newUsersContentDiv');
    managerDiv.hide();
    newUsersContentDiv.hide();
    var allUsersHead = $('div#allUsersHead');
    var newUsersHead = $('div#newUsersHead');
    allUsersHead.removeClass().addClass('usersTableHeadClick');

    // 当manager窗体的all users标签被点击时，该标签北京变为白色，另一个标签则成为绿色,并且从服务器获取所有用户的信息（不包括没有登陆权限的用户）
    allUsersHead.click(function()
    {
        $('div.usersTableHeadClick').removeClass().addClass('usersTableHead');
        $(this).removeClass().addClass('usersTableHeadClick');
        allUsersContentDiv.show();
        newUsersContentDiv.hide();
    });

    // 当manager窗体的new users标签被点击时，该标签变为白色，另一个变成绿色，并且从服务器获取没有登陆权限但是已经注册的用户（is_active = false）
    newUsersHead.click(function()
    {
        $('div.usersTableHeadClick').removeClass().addClass('usersTableHead');
        $(this).removeClass().addClass('usersTableHeadClick');
        allUsersContentDiv.hide();
        newUsersContentDiv.show();
    });
    // 创建可拖动元素
    // element：需要拖动的元素
    // handler：拖动的手柄
    // 拖动范围的参数，默认为'document'
    function dialogDrag(element, handler, limit)
    {
        var con;
        if(limit == undefined)
        {
            con = 'document';
        }
        else
        {
            con = limit;
        }
        element.draggable({
            handle: handler,
            cursor: 'move',
            containment: con,
            start: function()
            {
                $(this).css({'opacity': '0.3'});
                $('.ui-draggable').css({'z-index': '1'});
                $(this).css({'z-index': '100'});
            },
            stop: function()
            {
                $(this).css({'opacity': '1'});
            }
        });
    }

    // url: post的地址
    // content: post的内容
    // return: xml文档
    function post(url, content, func)
    {
        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function()
        {
            if(xmlhttp.readyState == 1 || xmlhttp.readyState == 2
                || xmlhttp.readyState == 3)
            {
                return false;
            }
            else if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                var receive = xmlhttp.responseText;
                if(func != undefined)
                {
                    func(receive);
                }
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(content);
    }

    // 当点击管理按钮时，弹出管理窗体
    $('div#manager').click(function()
    {
        $('div#usersHead').remove();
        $('div#allUsersContentDiv').empty();
        $('div#newUsersContentDiv').empty();
        managerDiv.fadeIn('fast');
        dialogDrag(managerDiv, managerHeader);
        managerClose.click(function()
        {
            managerDiv.fadeOut('fast');
        });
        post('/allusers/', 'users=allusers', renderUsers);
    });

    // 处理users，如果该用户的is_active = false（不可登陆），则将该用户添加到newUsersContentDiv当中去
    // 如果该用户可登陆，则将该用户添加到allUsersContentDiv中
    function renderUsers(receive) {
        // 获取一个用户的全部信息
        function one(element) {
            return {
                username: element.find('username').text(),
                password: element.find('password').text(),
                email: element.find('email').text(),
                datejoined: element.find('datejoined').text(),
                lastlogin: element.find('lastlogin').text(),
                isactive: element.find('isactive').text(),
                isstaff: element.find('isstaff').text(),
                weixin: element.find('weixin').text(),
                phone: element.find('phone').text(),
                question: element.find('question').text(),
                answer: element.find('answer').text()
            }
        }

        // 生成一个用户的html文本
        function oneHtml(aUser) {
            var html = "<div class = 'aUser' id = '" + aUser.username + "'>" +
                            "<div class = 'userItem username'>" + aUser.username + "</div>" +
                            "<div class = 'userItem password'>" + "<div class = 'passwordReset'>reset</div>" + "</div>" +
                            "<div class = 'userItem datejoined'>" + aUser.datejoined + "</div>" +
                            "<div class = 'userItem lastlogin'>" + aUser.lastlogin + "</div>" +
                            "<div class = 'userItem isactive'>" + "<div class = 'isactiveCheckedDiv'><input type = 'checkbox' checked = '" + aUser.isactive + "'/></div>" + "</div>" +
                            "<div class = 'userItem isstaff'>" + "<div class = 'isstaffCheckedDiv'><input type = 'checkbox' checked = '" + aUser.isstaff + "'/></div>" + "</div>" +
                            "<div class = 'userItem email'>" + aUser.email + "</div>" +
                            "<div class = 'userItem weixin'>" + aUser.weixin + "</div>" +
                            "<div class = 'userItem phone'>" + aUser.phone + "</div>" +
                            "<div class = 'userItem question'>" + aUser.question + "</div>" +
                            "<div class = 'userItem answer'>" + aUser.answer + "</div>" +
                        "</div>";
            return html 
        }

        var usersHeadHtml = "<div id = 'usersHead'>" +
                                "<div class = 'usersHeadItem' id = 'usernameHead'>username</div>" +
                                "<div class = 'usersHeadItem' id = 'passwordHead'>password</div>" +
                                "<div class = 'usersHeadItem' id = 'datejoinedHead'>datejoined</div>" +
                                "<div class = 'usersHeadItem' id = 'lastloginHead'>lastlogin</div>" +
                                "<div class = 'usersHeadItem' id = 'isactiveHead'>locked</div>" +
                                "<div class = 'usersHeadItem' id = 'isstaffHead'>deleted</div>" +
                                "<div class = 'usersHeadItem' id = 'emailHead'>email</div>" +
                                "<div class = 'usersHeadItem' id = 'weixinHead'>wechat</div>" +
                                "<div class = 'usersHeadItem' id = 'phoneHead'>phone</div>" +
                                "<div class = 'usersHeadItem' id = 'questionHead'>question</div>" +
                                "<div class = 'usersHeadItem' id = 'answerHead'>answer</div>" +
                            "</div>";
        $('div#managerContentDiv').prepend(usersHeadHtml);

        $(receive).find('user').each(function() {
            var isactive = $(this).find('isactive').text();
            var isstaff = $(this).find('isstaff').text();
            if(isactive == 'True'){
                isactive = true;
            }
            else
            {
                isactive = false;
            }

            if(isactive)
            {
                allUsersContentDiv.append(oneHtml(one($(this))));
            }
            else
            {
                newUsersContentDiv.append(oneHtml(one($(this))));
            }
        });
    }
});