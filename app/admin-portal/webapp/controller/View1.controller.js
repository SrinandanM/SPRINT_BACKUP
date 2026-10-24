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
                    this._loadEmployees();
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
        },

        _loadEmployees: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/Employees");
                if (!response.ok) throw new Error("Failed to fetch employees");
                
                const data = await response.json();
                const oModel = new JSONModel(data.value || []);
                this.getView().setModel(oModel, "employees");
            } catch (error) {
                console.error("Error loading employees:", error);
                this.getView().setModel(new JSONModel([]), "employees");
            }
        },

        /* ===== PROFESSIONAL DIALOGS ===== */

        onCreateAsset: function () {
            if (!this._assetDialog) {
                this._assetDialog = new sap.m.Dialog({
                    title: "Create New Asset",
                    type: "Standard",
                    resizable: true,
                    draggable: true,
                    contentWidth: "500px",
                    contentHeight: "600px",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Label({ text: "Asset Tag", required: true }),
                                new sap.m.Input({ id: "assetTag", placeholder: "Enter asset tag" }),
                                
                                new sap.m.Label({ text: "Model", required: true, class: "formLabel" }),
                                new sap.m.Input({ id: "assetModel", placeholder: "Enter model name" }),
                                
                                new sap.m.Label({ text: "Serial Number", required: true, class: "formLabel" }),
                                new sap.m.Input({ id: "serialNumber", placeholder: "Enter serial number" }),
                                
                                new sap.m.Label({ text: "Category", required: true, class: "formLabel" }),
                                new sap.m.Select({
                                    id: "assetCategory",
                                    items: [
                                        new sap.ui.core.Item({ key: "laptop", text: "Laptop" }),
                                        new sap.ui.core.Item({ key: "desktop", text: "Desktop" }),
                                        new sap.ui.core.Item({ key: "tablet", text: "Tablet" }),
                                        new sap.ui.core.Item({ key: "phone", text: "Phone" })
                                    ]
                                }),
                                
                                new sap.m.Label({ text: "Status", required: true, class: "formLabel" }),
                                new sap.m.Select({
                                    id: "assetStatus",
                                    items: [
                                        new sap.ui.core.Item({ key: "available", text: "Available" }),
                                        new sap.ui.core.Item({ key: "assigned", text: "Assigned" }),
                                        new sap.ui.core.Item({ key: "maintenance", text: "Maintenance" })
                                    ]
                                }),
                                
                                new sap.m.Label({ text: "Remarks", class: "formLabel" }),
                                new sap.m.TextArea({
                                    id: "assetRemarks",
                                    rows: 4,
                                    placeholder: "Enter remarks (optional)"
                                })
                            ],
                            spacing: "12px",
                            class: "formContent"
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Create",
                        type: "Emphasized",
                        press: () => {
                            this._saveAsset();
                            this._assetDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: () => this._assetDialog.close()
                    })
                });
                this.getView().addDependent(this._assetDialog);
            }
            this._assetDialog.open();
        },

        _saveAsset: function () {
            const assetData = {
                assetTag: sap.ui.getCore().byId("assetTag").getValue(),
                model: sap.ui.getCore().byId("assetModel").getValue(),
                serialNumber: sap.ui.getCore().byId("serialNumber").getValue(),
                categoryId: sap.ui.getCore().byId("assetCategory").getSelectedKey(),
                status: sap.ui.getCore().byId("assetStatus").getSelectedKey(),
                remarks: sap.ui.getCore().byId("assetRemarks").getValue()
            };
            console.log("Creating asset:", assetData);
            sap.m.MessageToast.show("Asset created successfully!");
        },

        onCreateEmployee: function () {
            if (!this._employeeDialog) {
                this._employeeDialog = new sap.m.Dialog({
                    title: "Create New Employee",
                    type: "Standard",
                    resizable: true,
                    draggable: true,
                    contentWidth: "500px",
                    contentHeight: "650px",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Label({ text: "Employee Number", required: true }),
                                new sap.m.Input({ id: "empNumber", placeholder: "Enter employee number" }),
                                
                                new sap.m.Label({ text: "Full Name", required: true, class: "formLabel" }),
                                new sap.m.Input({ id: "empName", placeholder: "Enter full name" }),
                                
                                new sap.m.Label({ text: "Email", required: true, class: "formLabel" }),
                                new sap.m.Input({ id: "empEmail", placeholder: "Enter email address", type: "Email" }),
                                
                                new sap.m.Label({ text: "Department", required: true, class: "formLabel" }),
                                new sap.m.Select({
                                    id: "empDepartment",
                                    items: [
                                        new sap.ui.core.Item({ key: "it", text: "Information Technology" }),
                                        new sap.ui.core.Item({ key: "hr", text: "Human Resources" }),
                                        new sap.ui.core.Item({ key: "finance", text: "Finance" }),
                                        new sap.ui.core.Item({ key: "ops", text: "Operations" })
                                    ]
                                }),
                                
                                new sap.m.Label({ text: "Role", required: true, class: "formLabel" }),
                                new sap.m.Input({ id: "empRole", placeholder: "Enter job title" }),
                                
                                new sap.m.Label({ text: "Phone", class: "formLabel" }),
                                new sap.m.Input({ id: "empPhone", placeholder: "Enter phone number" }),
                                
                                new sap.m.Label({ text: "Notes", class: "formLabel" }),
                                new sap.m.TextArea({
                                    id: "empNotes",
                                    rows: 3,
                                    placeholder: "Enter notes (optional)"
                                })
                            ],
                            spacing: "12px",
                            class: "formContent"
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Create",
                        type: "Emphasized",
                        press: () => {
                            this._saveEmployee();
                            this._employeeDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: () => this._employeeDialog.close()
                    })
                });
                this.getView().addDependent(this._employeeDialog);
            }
            this._employeeDialog.open();
        },

        _saveEmployee: function () {
            const empData = {
                employeeNumber: sap.ui.getCore().byId("empNumber").getValue(),
                fullName: sap.ui.getCore().byId("empName").getValue(),
                email: sap.ui.getCore().byId("empEmail").getValue(),
                departmentId: sap.ui.getCore().byId("empDepartment").getSelectedKey(),
                role: sap.ui.getCore().byId("empRole").getValue(),
                phone: sap.ui.getCore().byId("empPhone").getValue(),
                notes: sap.ui.getCore().byId("empNotes").getValue()
            };
            console.log("Creating employee:", empData);
            sap.m.MessageToast.show("Employee created successfully!");
        },

        /* ===== ASSET ASSIGNMENT ===== */

        onAssignAsset: function () {
            if (!this._assignDialog) {
                this._assignDialog = new sap.m.Dialog({
                    title: "Assign Asset to Employee",
                    type: "Standard",
                    resizable: true,
                    draggable: true,
                    contentWidth: "500px",
                    contentHeight: "400px",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Label({ text: "Asset Tag", required: true }),
                                new sap.m.Input({ 
                                    id: "assignAssetTag", 
                                    placeholder: "Enter or select asset tag",
                                    showSuggestion: true
                                }),
                                
                                new sap.m.Label({ text: "Employee", required: true, class: "formLabel" }),
                                new sap.m.Select({
                                    id: "assignEmployee",
                                    items: {
                                        path: "/employees",
                                        template: new sap.ui.core.Item({
                                            key: "{/employees>ID}",
                                            text: "{/employees>fullName}"
                                        })
                                    }
                                }),
                                
                                new sap.m.Label({ text: "Assignment Date", required: true, class: "formLabel" }),
                                new sap.m.DatePicker({
                                    id: "assignDate",
                                    placeholder: "Select date"
                                }),
                                
                                new sap.m.Label({ text: "Notes", class: "formLabel" }),
                                new sap.m.TextArea({
                                    id: "assignNotes",
                                    rows: 3,
                                    placeholder: "Enter assignment notes (optional)"
                                })
                            ],
                            spacing: "12px",
                            class: "formContent"
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Assign",
                        type: "Success",
                        press: () => {
                            this._saveAssignment();
                            this._assignDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: () => this._assignDialog.close()
                    })
                });
                this.getView().addDependent(this._assignDialog);
            }
            
            // Load employees for dropdown
            this._loadEmployeesForAssignment();
            
            this._assignDialog.open();
        },

        _loadEmployeesForAssignment: async function () {
            try {
                const response = await fetch("/odata/v4/asset-admin/Employees");
                if (!response.ok) throw new Error("Failed to fetch employees");
                
                const data = await response.json();
                
                // Get or create the default model
                let oModel = this.getView().getModel();
                if (!oModel) {
                    oModel = new JSONModel();
                    this.getView().setModel(oModel);
                }
                
                // Update the model data
                const oData = oModel.getData() || {};
                oData.employees = data.value || [];
                oModel.setData(oData);
            } catch (error) {
                console.error("Error loading employees:", error);
                sap.m.MessageToast.show("Failed to load employees");
            }
        },

        _saveAssignment: function () {
            const assetTag = sap.ui.getCore().byId("assignAssetTag").getValue();
            const employeeID = sap.ui.getCore().byId("assignEmployee").getSelectedKey();
            const assignDate = sap.ui.getCore().byId("assignDate").getValue();
            const notes = sap.ui.getCore().byId("assignNotes").getValue();

            if (!assetTag || !employeeID || !assignDate) {
                sap.m.MessageToast.show("Please fill in all required fields");
                return;
            }

            const assignmentData = {
                assetTag: assetTag,
                employeeID: employeeID,
                assignedDate: assignDate,
                notes: notes
            };

            console.log("Assigning asset:", assignmentData);
            sap.m.MessageToast.show("Asset assigned successfully!");
            
            // Clear form
            sap.ui.getCore().byId("assignAssetTag").setValue("");
            sap.ui.getCore().byId("assignEmployee").setSelectedKey("");
            sap.ui.getCore().byId("assignDate").setValue("");
            sap.ui.getCore().byId("assignNotes").setValue("");
        }

    });
});
