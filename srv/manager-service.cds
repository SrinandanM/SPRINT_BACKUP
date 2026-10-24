using { asset.lifecycle.db as db } from '../db/schema';

service AssetManagerService {

    /* =========================================
       EMPLOYEE MANAGEMENT
       ========================================= */

    entity Employees as projection on db.Employees;

    entity Departments as projection on db.Departments;

    /* =========================================
       REFERENCE DATA (READ ONLY)
       ========================================= */

    entity AssetCategories as projection on db.AssetCategories;

    entity Assets as projection on db.Assets;

    /* =========================================
       REQUEST MANAGEMENT
       ========================================= */

@odata.draft.enabled
entity AssetRequests as projection on db.AssetRequests;

    /* =========================================
       DASHBOARD KPIs (READ ONLY FOR MANAGER)
       ========================================= */

    entity AssetStatusChart as projection on db.AssetStatusChart;
    entity AssetCategoryChart as projection on db.AssetCategoryChart;
    entity DepartmentAssetChart as projection on db.DepartmentAssetChart;
    entity AssetKPIs as projection on db.AssetKPIs;

    action CreateAssetRequest(
        employeeID    : UUID,
        categoryID    : UUID,
        justification : String
    );
    
    action AssignApprovedAsset(
        requestID : UUID,
        assetID   : UUID
    );
}
