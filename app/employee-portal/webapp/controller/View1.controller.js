sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    JSONModel
) {
    "use strict";

    return Controller.extend(
        "employeeportal.controller.View1",
        {

            onInit: function () {
                this._initializeDashboard();
            },

            onMenuToggle: function () {
                const oSidebar = this.byId("sidebarContainer");
                const bVisible = oSidebar.getVisible();
                oSidebar.setVisible(!bVisible);
                
                // Adjust content area width
                const oContentArea = this.byId("contentArea");
                if (!bVisible) {
                    oContentArea.setWidth("100%");
                    oSidebar.setWidth("280px");
                } else {
                    oContentArea.setWidth("100%");
                }
            },

            _initializeDashboard: function () {
                // Initialize dashboard model with default values
                const oDashboardModel = new JSONModel({
                    assignedAssets: 0,
                    pendingRequests: 0,
                    maintenanceAssets: 0,
                    warrantyPercentage: 65,
                    depreciationPercentage: 35,
                    maintenanceMonths: 12,
                    employeeName: "Loading...",
                    employeeNumber: "",
                    email: "",
                    department: "",
                    role: ""
                });
                this.getView().setModel(oDashboardModel);
                
                // Load actual data
                this._loadAssets();
                this._loadRequests();
                this._loadProfile();
            },
            _loadAssets: async function () {

    const response = await fetch(
        "/odata/v4/asset-employee/Assets"
    );

    const data = await response.json();

    const oModel =
new JSONModel(
                data.value
        );

    this.getView().setModel(
        oModel,
        "assets"
    );
},

_loadRequests: async function () {

    const response = await fetch(
        "/odata/v4/asset-employee/AssetRequests"
    );

    const data = await response.json();

    const oModel =
new JSONModel(
                data.value
        );

    this.getView().setModel(
        oModel,
        "requests"
    );

},

_loadProfile: async function () {

    const response = await fetch(
        "/odata/v4/asset-employee/Employees"
    );

    const data = await response.json();

    if (
        data.value &&
        data.value.length > 0
    ) {

        const oModel =
            new JSONModel(
                data.value[0]
            );

        this.getView().setModel(
            oModel,
            "profile"
        );

    }

},

            onMenuSelect: function (oEvent) {

                const sTitle =
                    oEvent.getParameter("listItem")
                        .getTitle();

                this.byId("dashboardContainer")
                    .setVisible(false);

                this.byId("assetsContainer")
                    .setVisible(false);

                this.byId("requestsContainer")
                    .setVisible(false);

                this.byId("profileContainer")
                    .setVisible(false);

                switch (sTitle) {

                    case "Dashboard":

                        this.byId("dashboardContainer")
                            .setVisible(true);

                        break;

                    case "My Assets":

                        this._loadAssets();

                        this.byId("assetsContainer")
                            .setVisible(true);

                        break;

                    case "My Requests":

                        this._loadRequests();

                        this.byId("requestsContainer")
                            .setVisible(true);

                        break;

                    case "My Profile":

                        this._loadProfile();

                        this.byId("profileContainer")
                            .setVisible(true);

                        break;
                }
            },

            formatStatusState: function (sStatus) {
                if (!sStatus) return "None";
                const status = sStatus.toLowerCase();
                if (status === "active" || status === "available") return "Success";
                if (status === "inactive" || status === "retired") return "Error";
                if (status === "maintenance" || status === "in-maintenance") return "Warning";
                return "None";
            },

            formatRequestStatus: function (sStatus) {
                if (!sStatus) return "None";
                const status = sStatus.toLowerCase();
                if (status === "approved" || status === "accepted") return "Success";
                if (status === "rejected" || status === "denied") return "Error";
                if (status === "pending" || status === "awaiting-approval") return "Warning";
                return "None";
            }

        }
    );
});