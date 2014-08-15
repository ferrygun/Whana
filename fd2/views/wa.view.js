sap.ui.jsview("views.wa", {
    /** Specifies the Controller belonging to this View.
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf views.Companies
     */
    getControllerName: function() {
        return "views.wa";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf views.Companies
     */
    createContent: function(oController) {
        oController.oModel = new sap.ui.model.json.JSONModel();
        oController.oModel.loadData("services/GetFileName.xsjs");



        var oPanel = new sap.ui.commons.Panel().setText('Whana - WhatsApp & HANA');



        jQuery.sap.require("sap.ui.core.IconPool");
        //Define Table (needs sap.ui.table)
        var oTable = new sap.ui.table.Table("CCTV", {
            tableId: "CCTVId",
            visibleRowCount: 5,
            toolbar: new sap.ui.commons.Toolbar({
                items: [
                    new sap.ui.commons.Button({
                        text: "Refresh Data",
                        press: function() {
                            oController.oModel.loadData("services/GetFileName.xsjs");
                        }
                    })
                ]
            })
        });

        var oControl;


        vCol = "file_name";
        oControl = new sap.ui.commons.TextField({
            editable: false
        }).bindProperty("value", vCol);
        //Add
        oTable.addColumn(new sap.ui.table.Column({
            label: new sap.ui.commons.Label({
                text: "File Image"
            }),
            template: oControl,
            sortProperty: vCol,
            filterProperty: vCol
        }));



        //Sort Table
        oTable.sort(oTable.getColumns()[0]);


        oTable.attachRowSelectionChange(function(oEvent) {
            var currentRowContext = oEvent.getParameter("rowContext");
            var fname = oController.oModel.getProperty("file_name", currentRowContext);


            console.log(fname);
            oController.actSearch(fname);

        });


        //Prepare output
        oTable.setModel(oController.oModel);
        oTable.bindRows("/");
        oPanel.addContent(oTable);

        return oPanel;

    }
});
