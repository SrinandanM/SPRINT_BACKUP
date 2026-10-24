sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("asset.lifecycle.portal.adminportal.controller.View1", {

        onInit: function () {
            this._loadDashboardData();
        },

        onMenuToggle: function () {
            const oSidebar = this.byId("sidebarContainer");
            const bVisible = oSidebar.getVisible();
            oSidebar.setVisible(!bVisible);
        },

        onMenuSelect: function (oEvent) {
            const sTitle = oEvent.getParameter("listItem").getTitle();
            
            // Hide all containers
            this.byId("dashboardContainer").setVisible(false);
            this.byId("assetsContainer").setVisible(false);
            this.byId("requestsContainer").setVisible(false);
            this.byId("employeesContainer").setVisible(false);
            this.byId("departmentsContainer").setVisible(false);
            this.byId("vendorsContainer").setVisible(false);
            this.byId("categoriesContainer").setVisible(false);
            this.byId("reportsContainer").setVisible(false);

            // Show selected container and load data
            switch (sTitle) {
                case "Dashboard":
                    this.byId("dashboardContainer").setVisible(true);
                    break;
                case "Assets":
                    this.byId("assetsContainer").setVisible(true);
                    this._loadAssets();
                    break;
                case "Requests":
                    this.byId("requestsContainer").setVisible(true);
                    this._loadRequests();
                    break;
                case "Employees":
                    this.byId("employeesContainer").setVisible(true);
                    break;
                case "Departments":
                    this.byId("departmentsContainer").setVisible(true);
                    break;
                case "Vendors":
                    this.byId("vendorsContainer").setVisible(true);
                    break;
                case "Categories":
                    this.byId("categoriesContainer").setVisible(true);
                    break;
                case "Reports":
                    this.byId("reportsContainer").setVisible(true);
                    break;
            }

            // Close sidebar after selection
            this.onMenuToggle();
        },

        _loadDashboardData: async function () {
            try {
                await this._loadKPIs();
                await this._loadStatusChart();
                await this._loadCategoryChart();
                await this._loadDepartmentChart();
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        },

        _loadKPIs: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/AssetKPIs");
                if (!response.ok) throw new Error("Failed to fetch KPIs");
                
                const data = await response.json();
                if (data.value && data.value.length > 0) {
                    const oModel = new JSONModel(data.value[0]);
                    this.getView().setModel(oModel, "kpi");
                } else {
                    console.warn("No KPI data received");
                }
            } catch (error) {
                console.error("Error loading KPIs:", error);
                // Set default empty values
                const oModel = new JSONModel({
                    totalAssets: 0,
                    availableAssets: 0,
                    assignedAssets: 0,
                    maintenanceAssets: 0,
                    retiredAssets: 0,
                    archivedAssets: 0
                });
                this.getView().setModel(oModel, "kpi");
            }
        },

        _loadStatusChart: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/AssetStatusChart");
                if (!response.ok) throw new Error("Failed to fetch status chart");
                
                const data = await response.json();
                const oModel = new JSONModel(data.value || []);
                this.getView().setModel(oModel, "status");
            } catch (error) {
                console.error("Error loading status chart:", error);
                this.getView().setModel(new JSONModel([]), "status");
            }
        },

        _loadCategoryChart: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/AssetCategoryChart");
                if (!response.ok) throw new Error("Failed to fetch category chart");
                
                const data = await response.json();
                const oModel = new JSONModel(data.value || []);
                this.getView().setModel(oModel, "category");
            } catch (error) {
                console.error("Error loading category chart:", error);
                this.getView().setModel(new JSONModel([]), "category");
            }
        },

        _loadDepartmentChart: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/AssetDepartmentChart");
                if (!response.ok) throw new Error("Failed to fetch department chart");
                
                const data = await response.json();
                const oModel = new JSONModel(data.value || []);
                this.getView().setModel(oModel, "department");
            } catch (error) {
                console.error("Error loading department chart:", error);
                this.getView().setModel(new JSONModel([]), "department");
            }
        },

        _loadAssets: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/Assets");
                if (!response.ok) throw new Error("Failed to fetch assets");
                
                const data = await response.json();
                const oModel = new JSONModel(data.value || []);
                this.getView().setModel(oModel, "assets");
            } catch (error) {
                console.error("Error loading assets:", error);
                this.getView().setModel(new JSONModel([]), "assets");
            }
        },

        _loadRequests: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/AssetRequests");
                if (!response.ok) throw new Error("Failed to fetch requests");
                
                const data = await response.json();
                const oModel = new JSONModel(data.value || []);
                this.getView().setModel(oModel, "requests");
            } catch (error) {
                console.error("Error loading requests:", error);
                this.getView().setModel(new JSONModel([]), "requests");
            }
        }

    });
});
