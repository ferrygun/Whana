var query = "Select \"File_Name\" From \"NEO_CG2SX3P5XHHQEO58DKM7BWU0V\".\"p1940803061trial.fd2.data::mytable\" ";

function close(closables) {
    var closable;
    var i;
    for (i = 0; i < closables.length; i++) {
        closable = closables[i];
        if (closable) {
            closable.close();
        }
    }
}

function getFileName() {
    var FNameList = [];

    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;

    try {

        statement = connection.prepareStatement(query);
        resultSet = statement.executeQuery();
        while (resultSet.next()) {
            var fname = {};
            fname.file_name = resultSet.getString(1);
            FNameList.push(fname);
        }

    } finally {
        close([resultSet, statement, connection]);
    }
    return FNameList;
}

function doGetFileName() {
    try {
        $.response.contentType = "application/json";
        $.response.setBody(JSON.stringify(getFileName()));
    } catch (err) {
        $.response.contentType = "text/plain";
        $.response.setBody("Error while executing query: [" + err.message + "]");
        $.response.returnCode = 200;
    }
}


doGetFileName();
