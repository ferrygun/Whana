    var id = $.request.parameters.get('id');


    var conn = $.db.getConnection();

    try {
        var query = "Select \"File_Content\" From \"NEO_CG2SX3P5XHHQEO58DKM7BWU0V\".\"p1940803061trial.fd2.data::mytable\" Where \"File_Name\" = " + id;

        var pstmt = conn.prepareStatement(query);
        var rs = pstmt.executeQuery();
        rs.next();
        $.response.headers.set("Content-Disposition", "Content-Disposition: attachment; filename=filename.jpg");
        $.response.contentType = 'image/jpg';
        $.response.setBody(rs.getBlob(1));
        $.response.status = $.net.http.OK;
    } catch (e) {
        $.response.setBody("Error while downloading : " + e);
        $.response.status = 500;
    }
    conn.close();
